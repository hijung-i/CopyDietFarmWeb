import { NextFunction, Request, Response, Router } from 'express'
import { StatusCode, StatusMessage, UserResult } from '../models/response'
import { NiceUser, SessionUser, User } from '../models/user'
import userService from '../services/userService'
import { exec } from 'child_process'
import * as path from 'path'

import { globalData } from '../app'

const router = Router()

/****************************
 *  SCRIPTS FOR NICE IDENTIFIER
 *  Author: jgpark
 */

const sSiteCode = 'BT514'
const sSitePW = 'tQSumidmqcYh'

const sModulePath = path.join(globalData.getBaseDir(), 'nice_modules/window/CPClient.exe')
// const sModulePath = '/home/dataflow1/DietFarm/Api/nice_modules/linux/CPClient_64bit'

// 우분투
// const serverIp = '112.217.209.162:3000'
const serverIp = 'localhost:3000'
const sAuthType = ''
const sPopGubun = 'Y'
const sCustomize = ''
const sGender = ''

router.get('/identifying-page', (req: Request, res: Response) => {
    // 업체 요청 번호
    // 세션등에 저장하여 데이터 위변조 검사 (인증후에 다시 전달)
    const nextMethod = req.query.nextMethod
    const d = new Date()
    const sCPRequest = sSiteCode + '_' + d.getTime()

    // 전달 원문 데이터 초기화
    let sPlaincData = ''
    // 전달 암호화 데이터 초기화
    let sEncData = ''
    // 처리 결과 메시지
    let sRtnMSG = ''

    let sReturnUrl = `http://${serverIp}/nice/` // 성공시 이동될 URL (방식 : 프로토콜을 포함한 절대 주소)
    let sErrorUrl = `http://${serverIp}/nice/` // 실패시 이동될 URL (방식 : 프로토콜을 포함한 절대 주소)
    switch (nextMethod) {
        case 'register':
            sReturnUrl += 'success-register'
            break
        case 'find-id':
            sReturnUrl += 'success-find-id'
            break
        case 'find-pw':
            sReturnUrl += 'success-find-pw'
            break
    }

    sPlaincData = '7:REQ_SEQ' + sCPRequest.length + ':' + sCPRequest +
                  '8:SITECODE' + sSiteCode.length + ':' + sSiteCode +
                  '9:AUTH_TYPE' + sAuthType.length + ':' + sAuthType +
                  '7:RTN_URL' + sReturnUrl.length + ':' + sReturnUrl +
                  '7:ERR_URL' + sErrorUrl.length + ':' + sErrorUrl +
                  '11:POPUP_GUBUN' + sPopGubun.length + ':' + sPopGubun +
                  '9:CUSTOMIZE' + sCustomize.length + ':' + sCustomize +
                  '6:GENDER' + sGender.length + ':' + sGender
    console.log('[' + sPlaincData + ']')

    const cmd = sModulePath + ' ' + 'ENC' + ' ' + sSiteCode + ' ' + sSitePW + ' ' + sPlaincData

    const child = exec(cmd , { encoding: 'utf-8' })

    child.stdout?.on('data', function(data) {
        sEncData += data
    })

    child.on('close', function() {
        console.log('child on close sEncData =', sEncData)
        if (sEncData === '-1') {
          sRtnMSG = '암/복호화 시스템 오류입니다.'
        } else if (sEncData === '-2') {
          sRtnMSG = '암호화 처리 오류입니다.'
        } else if (sEncData === '-3') {
          sRtnMSG = '암호화 데이터 오류 입니다.'
        } else if (sEncData === '-9') {
          sRtnMSG = '입력값 오류 : 암호화 처리시, 필요한 파라미터 값을 확인해 주시기 바랍니다.'
        } else {
          sRtnMSG = ''
        }

        console.log('sRtnMSG = ', sRtnMSG)
        res.render('nice/checkplus_main_web.ejs', { sEncData , sRtnMSG, nextMethod })
    })
})

const identifyingSuccessPost = (req: Request, res: Response) => {
  const sEncData = req.body.EncodeData
  let cmd = ''

  if (/^0-9a-zA-Z+\/=/.test(sEncData) === true) {
      const sRtnMSG = '입력값 오류'
      const requestnumber = ''
      const authtype = ''
      const errcode = ''
      res.render('checkplus_fail.ejs', { sRtnMSG , requestnumber , authtype , errcode })
  }

  if (sEncData !== '') {
      cmd = sModulePath + ' ' + 'DEC' + ' ' + sSiteCode + ' ' + sSitePW + ' ' + sEncData
  }

  let sDecData = ''

  const child = exec(cmd , { encoding: 'utf-8' })
  child.stdout?.on('data', function(data) {
      sDecData += data
  })
  child.on('close', function() {
      let requestnumber: string = ''
      let responsenumber: string = ''
      let authtype: string = ''
      let name: string = ''
      let birthdate: string = ''
      let gender: string = ''
      let nationalinfo: string = ''
      let dupinfo: string = ''
      let conninfo: string = ''
      let mobileno: string = ''
      let mobileco: string = ''

      // 처리 결과 메시지
      let sRtnMSG = ''
      // 처리 결과 확인
      if (sDecData === '-1') {
        sRtnMSG = '암/복호화 시스템 오류'
      } else if (sDecData === '-4') {
        sRtnMSG = '복호화 처리 오류'
      } else if (sDecData === '-5') {
        sRtnMSG = 'HASH값 불일치 - 복호화 데이터는 리턴됨'
      } else if (sDecData === '-6') {
        sRtnMSG = '복호화 데이터 오류'
      } else if (sDecData === '-9') {
        sRtnMSG = '입력값 오류'
      } else if (sDecData === '-12') {
        sRtnMSG = '사이트 비밀번호 오류'
      } else {
        // 항목의 설명은 개발 가이드를 참조
        requestnumber = decodeURIComponent(GetValue(sDecData , 'REQ_SEQ'))     // CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
        responsenumber = decodeURIComponent(GetValue(sDecData , 'RES_SEQ'))    // 고유 번호 , 나이스에서 생성한 값을 되돌려준다.
        authtype = decodeURIComponent(GetValue(sDecData , 'AUTH_TYPE'))        // 인증수단
        name = decodeURIComponent(GetValue(sDecData , 'UTF8_NAME'))            // 이름
        birthdate = decodeURIComponent(GetValue(sDecData , 'BIRTHDATE'))       // 생년월일(YYYYMMDD)
        gender = decodeURIComponent(GetValue(sDecData , 'GENDER'))             // 성별
        nationalinfo = decodeURIComponent(GetValue(sDecData , 'NATIONALINFO')) // 내.외국인정보
        dupinfo = decodeURIComponent(GetValue(sDecData , 'DI'))                // 중복가입값(64byte)
        conninfo = decodeURIComponent(GetValue(sDecData , 'CI'))               // 연계정보 확인값(88byte)
        mobileno = decodeURIComponent(GetValue(sDecData , 'MOBILE_NO'))        // 휴대폰번호(계약된 경우)
        mobileco = decodeURIComponent(GetValue(sDecData , 'MOBILE_CO'))        // 통신사(계약된 경우)
      }
      console.log(sDecData)

      const userData: NiceUser = {
          userName: name,
          userInfo: birthdate,
          userGender: gender,
          dupInfo: dupinfo,
          userCellNo: mobileno
      }

      req.session.niceUserData = userData

      const nextMethod = req.query.nextMethod
      res.render('nice/checkplus_success', { sRtnMSG, requestnumber , responsenumber , authtype , name , birthdate , gender , nationalinfo , dupinfo , conninfo , mobileno , mobileco, nextMethod })
  })
}

const identifyingSuccessGet = (req: Request, res: Response) => {
  const sEncData = req.query?.EncodeData as string
  let cmd = ''

  if (/^0-9a-zA-Z+\/=/.test(sEncData) === true) {
      const sRtnMSG = '입력값 오류'
      const requestnumber = ''
      const authtype = ''
      const errcode = ''
      res.render('checkplus_fail.ejs', { sRtnMSG , requestnumber , authtype , errcode })
  }

  if (sEncData !== '') {
      cmd = sModulePath + ' ' + 'DEC' + ' ' + sSiteCode + ' ' + sSitePW + ' ' + sEncData
  }

  let sDecData = ''

  const child = exec(cmd , { encoding: 'utf-8' })
  child.stdout?.on('data', function(data) {
      sDecData += data
  })
  child.on('close', function() {
      let requestnumber: string = ''
      let responsenumber: string = ''
      let authtype: string = ''
      let name: string = ''
      let birthdate: string = ''
      let gender: string = ''
      let nationalinfo: string = ''
      let dupinfo: string = ''
      let conninfo: string = ''
      let mobileno: string = ''
      let mobileco: string = ''

      // 처리 결과 메시지
      let sRtnMSG = ''
      // 처리 결과 확인
      if (sDecData === '-1') {
        sRtnMSG = '암/복호화 시스템 오류'
      } else if (sDecData === '-4') {
        sRtnMSG = '복호화 처리 오류'
      } else if (sDecData === '-5') {
        sRtnMSG = 'HASH값 불일치 - 복호화 데이터는 리턴됨'
      } else if (sDecData === '-6') {
        sRtnMSG = '복호화 데이터 오류'
      } else if (sDecData === '-9') {
        sRtnMSG = '입력값 오류'
      } else if (sDecData === '-12') {
        sRtnMSG = '사이트 비밀번호 오류'
      } else {
        // 항목의 설명은 개발 가이드를 참조
        requestnumber = decodeURIComponent(GetValue(sDecData , 'REQ_SEQ'))     // CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
        responsenumber = decodeURIComponent(GetValue(sDecData , 'RES_SEQ'))    // 고유 번호 , 나이스에서 생성한 값을 되돌려준다.
        authtype = decodeURIComponent(GetValue(sDecData , 'AUTH_TYPE'))        // 인증수단
        name = decodeURIComponent(GetValue(sDecData , 'UTF8_NAME'))            // 이름
        birthdate = decodeURIComponent(GetValue(sDecData , 'BIRTHDATE'))       // 생년월일(YYYYMMDD)
        gender = decodeURIComponent(GetValue(sDecData , 'GENDER'))             // 성별
        nationalinfo = decodeURIComponent(GetValue(sDecData , 'NATIONALINFO')) // 내.외국인정보
        dupinfo = decodeURIComponent(GetValue(sDecData , 'DI'))                // 중복가입값(64byte)
        conninfo = decodeURIComponent(GetValue(sDecData , 'CI'))               // 연계정보 확인값(88byte)
        mobileno = decodeURIComponent(GetValue(sDecData , 'MOBILE_NO'))        // 휴대폰번호(계약된 경우)
        mobileco = decodeURIComponent(GetValue(sDecData , 'MOBILE_CO'))        // 통신사(계약된 경우)
      }
      console.log(sDecData)

      const userData: NiceUser = {
          userName: name,
          userInfo: birthdate,
          userGender: gender,
          dupInfo: dupinfo,
          userCellNo: mobileno
      }

      req.session.niceUserData = userData

      const nextMethod = req.query.nextMethod
      res.render('nice/checkplus_success', { sRtnMSG, requestnumber , responsenumber , authtype , name , birthdate , gender , nationalinfo , dupinfo , conninfo , mobileno , mobileco, nextMethod })
  })
}

// success for register
router.post('/success-register', (req: Request, res: Response) => {
    req.query.nextMethod = 'register'
    identifyingSuccessPost(req, res)
})

router.get('/success-register', (req: Request, res: Response) => {
    req.query.nextMethod = 'register'
    identifyingSuccessGet(req, res)
})

// success for find id
router.post('/success-find-id', (req: Request, res: Response) => {
    req.query.nextMethod = 'find-id'
    identifyingSuccessPost(req, res)
})
router.get('/success-find-id', (req: Request, res: Response) => {
    req.query.nextMethod = 'find-id'
    identifyingSuccessGet(req, res)
})

// success for find pw
router.post('/success-find-pw', (req: Request, res: Response) => {
  req.query.nextMethod = 'find-pw'
  identifyingSuccessPost(req, res)
})
router.get('/success-find-pw', (req: Request, res: Response) => {
  req.query.nextMethod = 'find-pw'
  identifyingSuccessGet(req, res)
})

function GetValue(plaindata: string, key: string) {
  let arrData = plaindata.split(':')
  let value = ''
  for (let i = 0; i < arrData.length; i++) {
      const item = arrData[i]
      if (item.indexOf(key) === 0) {
        const valLen = parseInt(item.replace(key, ''), 10)
        value = arrData[++i].substr(0, valLen)
        break
      }
  }
  return value
}

export default router