import { User } from '../models/user'
import * as request from 'request-promise-native'
import { setUserResult, StatusCode, StatusMessage, UserResult } from '../models/response'

type Option = {
    uri: string,
    method: string,
    headers?: {},
    json: boolean,
    body?: Object
}

class UserService {
    // SERVER_IP = 'dietfarm119.co.kr'
    SERVER_IP = '192.168.0.3'
    // SERVER_IP = 'localhost'
    // SERVER_IP = '112.217.209.162'
    // SERVER_IP = '13.209.123.102'

    SERVER_URL = 'http://' + this.SERVER_IP + ':9090'
    // SERVER_URL = 'http://dietfarm119.co.kr:9090'

    // CALLBACK_SERVER = 'http://' + this.SERVER_IP + ':3000'
    CALLBACK_SERVER = 'http://' + this.SERVER_IP
    // CALLBACK_SERVER = 'https://dietfarm.co.kr'

    KAKAO_SERVER = 'https://kauth.kakao.com'

    login = async (user: User): Promise<UserResult> => {
        let options: Option = {
            uri: `${this.SERVER_URL}/user/login`,
            method: 'POST',
            headers: {
                'Accept-Charset': 'application/json;charset=UTF-8',
                'Content-Type': 'application/json'
            },
            json: true,
            body: user
        }
        user.password = this.SHA256(user.userId + this.SHA256(user.password!))

        return request(options).then((res: any): UserResult => {
            return setUserResult(StatusCode.success, StatusMessage.success, res.result)
        }).catch((err: any): UserResult => {
            if (err) {
                console.log('Error occured while login', err.statusCode, err.error)
            }
            return setUserResult(StatusCode.error, err.error, null)
        })
    }

    loginKakao = async (user: User): Promise<UserResult> => {
        let options: Option = {
            uri: `${this.SERVER_URL}/user/loginKakaoUser`,
            method: 'POST',
            headers: {
                'Accept-Charset': 'application/json;charset=UTF-8',
                'Content-Type': 'application/json'
            },
            json: true,
            body: user
        }

        return request(options).then((res: any): UserResult => {
            return setUserResult(StatusCode.success, StatusMessage.success, res.result || {})
        }).catch((err: any): UserResult => {
            if (err) {
                console.log('Error occured while login', err.statusCode, err.error)
            }
            return setUserResult(StatusCode.error, err.error, null)
        })
    }

    loginNaver = async (tokenNaver: string): Promise<UserResult> => {
        let options: Option = {
            uri: `${this.SERVER_URL}/user/loginNaverUser`,
            method: 'POST',
            headers: {
                'Accept-Charset': 'application/json;charset=UTF-8',
                'Content-Type': 'application/json'
            },
            json: true,
            body: {
                tokenNaver
            }
        }
        console.log(options)

        return request(options).then((res: any): UserResult => {
            return setUserResult(StatusCode.success, StatusMessage.success, res.result || {})
        }).catch((err: any): UserResult => {
            if (err) {
                console.log('Error occured while loginNaver', err.statusCode, err.error)
            }
            return setUserResult(StatusCode.error, err.error, null)
        })
    }

    getNaverUserInfo = async (token: string) => {
        const apiUrl = 'https://openapi.naver.com/v1/nid/me'

        const options = {
            uri: `${apiUrl}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        return request(options).then((res: any) => {
            const result = JSON.parse(decodeURIComponent(res))
            const obj = result.response

            const userId = obj.id + '@n'
            const userCellNo = obj.mobile.replace(/-/gi, '')
            let userGender = obj.gender
            switch (obj.gender) {
                case 'F':
                    userGender = 'W'
                    break
                default:
                    userGender = 'X'
            }
            let userInfo = ''
            if (obj.birthyear !== undefined && obj.birthday !== undefined) {
                userInfo = obj.birthyear + obj.birthday.replace('-', '')
            }

            const userEmail = obj.email
            const userName = obj.name

            return {
                tokenNaver: obj.id, userId, userCellNo, userGender, userInfo, userEmail, userName, password: userId
            }
        }).catch((err: any) => {
            console.log('error while getNaverUserData', err)
            return null
        })
    }

    register = async (user: User): Promise<UserResult> => {
        let options: Option = {
            uri: `${this.SERVER_URL}/user/register`,
            method: 'POST',
            headers: {
                'Accept-Charset': 'application/json;charset=UTF-8',
                'Content-Type': 'application/json'
            },
            json: true,
            body: user
        }
        user.password = this.SHA256(user.password!)

        return request(options).then((res: any): UserResult => {
            console.log('after request', res)
            return setUserResult(StatusCode.success, StatusMessage.success, res.result || {})
        }).catch((err: any): UserResult => {
            if (err) {
                console.log('Error occured while login', err.statusCode, err.error)
            }
            return setUserResult(StatusCode.error, err.error, null)
        })
    }
    requestKakaoToken = async (code) => {

        const options = {
            uri: this.KAKAO_SERVER + '/oauth/token',
            method: 'POST',
            headers: {
                'Host': 'kauth.kakao.com',
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            json: false,
            form: {
                grant_type: 'authorization_code',
                redirect_uri: this.CALLBACK_SERVER + '/user/result/kakao',
                code: code,
                client_id: '23424519967349f9a1d006b09f81bb98',
                client_secret: 'Sv5VpQchcPw81uP51LZkxsaHpi4KOWjM'
            }
        }

        return request.post(options).then((res: any) => {
            console.log('GET /request/token > request result >>', res)
            const result = JSON.parse(res)
            return result
        }).catch((err: any) => {
            console.error('GET /request/token > request error >>', err.statusCode, err.error)
        })
    }

    requestKakaoUserInfo = async () => {
        const url = this.KAKAO_SERVER + '/v2/user/me'

        const options = {
            uri: url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }

        request(options).then((res: any) => {
            console.log('GET /user/me result >>', res)

        }).catch((err: any) => {
            console.error('GET /user/me error >>', err.statusCode, err.error)
        })
		// function(res) {
		// 	console.log(res)
		// 	var account = res.kakao_account;

		// 	var agreement = false;
		// 	if (account.birthday_needs_agreement == true ) {
		// 		agreement = true;
		// 	}
		// 	if (account.birthyear_needs_agreement == true ) {
		// 		agreement = true;
		// 	}
		// 	if (account.gender_needs_agreement == true ) {
		// 		agreement = true;
		// 	}

		// 	if(agreement) {
		// 		alert('선택 정보에 동의해주셔야 회원가입이 가능합니다.');
		// 		kakaoUnlink();
		// 		return;
		// 	}

		// 	var params = {
		// 		kakaoNo: res.id,
		// 		userEmail: account.email,
		// 		userName: account.profile.nickname,
		// 		userCellNo: account.phone_number.replace(/-/gi, '').replace('+82 ', '0').replace('+1 ', ''),
		// 		userInfo: account.birthyear + account.birthday
		// 	}

		// 	switch(account.gender) {
		// 		case 'male':
		// 			params.userGender = 'M'
		// 			break;
		// 		case 'female':
		// 			params.userGender = 'W'
		// 			break;
		// 		default:
		// 			params.userGender = 'X'
		// 			break;
		// 	}

		// 	params.userId = params.kakaoNo + '@K';
		// 	params.password = params.kakaoNo + '@K';

		// 	checkKakaoRegistration(params);
		// },
		// fail: function(error) {
		// 	console.log(
		// 		'login success, but failed to request user information: '
		// 		,error
		// 	)
		// },
    }

    SHA256 = (s: string): string => {
        let chrsz   = 8
        let hexcase = 0

        function safe_add (x, y) {
            let lsw = (x & 0xFFFF) + (y & 0xFFFF)
            let msw = (x >> 16) + (y >> 16) + (lsw >> 16)
            return (msw << 16) | (lsw & 0xFFFF)
        }

        function S (X, n) { return (X >>> n) | (X << (32 - n)) }

        function R (X, n) { return (X >>> n) }

        function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)) }

        function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)) }

        function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)) }

        function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)) }

        function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)) }

        function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)) }

        function core_sha256 (m, l) {
            let K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2)
            let HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19)
            let W = new Array(64)
            let a, b, c, d, e, f, g, h, i, j
            let T1, T2

            m[l >> 5] |= 0x80 << (24 - l % 32)
            m[((l + 64 >> 9) << 4) + 15] = l

            for (let i = 0; i < m.length; i += 16) {
                a = HASH[0]
                b = HASH[1]
                c = HASH[2]
                d = HASH[3]
                e = HASH[4]
                f = HASH[5]
                g = HASH[6]
                h = HASH[7]

                for (let j = 0; j < 64; j++) {
                    if (j < 16) W[j] = m[j + i]
                    else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16])
                    T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j])
                    T2 = safe_add(Sigma0256(a), Maj(a, b, c))
                    h = g
                    g = f
                    f = e
                    e = safe_add(d, T1)
                    d = c
                    c = b
                    b = a
                    a = safe_add(T1, T2)
                }

                HASH[0] = safe_add(a, HASH[0])
                HASH[1] = safe_add(b, HASH[1])
                HASH[2] = safe_add(c, HASH[2])
                HASH[3] = safe_add(d, HASH[3])
                HASH[4] = safe_add(e, HASH[4])
                HASH[5] = safe_add(f, HASH[5])
                HASH[6] = safe_add(g, HASH[6])
                HASH[7] = safe_add(h, HASH[7])
            }
            return HASH
        }

        function str2binb (str: string) {
            let bin = Array()
            let mask = (1 << chrsz) - 1
            for (let i = 0; i < str.length * chrsz; i += chrsz) {
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32)
            }
            return bin
        }

        function Utf8Encode(string: string) {
            string = string.replace(/\r\n/g,'\n')
            let utftext = ''

            for (let n = 0; n < string.length; n++) {
                let c = string.charCodeAt(n)
                if (c < 128) {
                    utftext += String.fromCharCode(c)
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192)
                    utftext += String.fromCharCode((c & 63) | 128)
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224)
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128)
                    utftext += String.fromCharCode((c & 63) | 128)
                }
            }
            return utftext
        }

        function binb2hex(binarray) {
            let hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef'
            let str = ''
            for (let i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF)
            }
            return str
        }
        s = Utf8Encode(s)
        return binb2hex(core_sha256(str2binb(s), s.length * chrsz))
    }

}
export default new UserService()
