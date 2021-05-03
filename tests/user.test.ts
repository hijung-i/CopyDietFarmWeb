import { expect } from 'chai'
import { UserResult } from '../src/models/response'
import { User } from '../src/models/user'
import UserSerivce from '../src/services/userService'

describe('login', () => {
    it('registerResult Object ', async () => {
        const user: User = {
            userId: 'jgpark',
            password: UserSerivce.SHA256('jgpark'+(UserSerivce.SHA256('qkrwlsrnr1')))
        }

        const registerResult: UserResult = await UserSerivce.login(user)
        console.log(registerResult)
    })
})

describe('register', () => {
    it('registerResult Object ', async () => {

        const user: User = {
            userId: 'jgpark',
            password: UserSerivce.SHA256('qkrwlsrnr1'),
            userName: '박진국',
            userGender: 'M',
            userCellNo: '01055431787',
            userInfo: '20000623',
            dupInfo: '1234',
            marketingAlert: 'Y',
            serviceAlert: 'Y',
            userEmail: 'jgpark@data-flow.co.kr',
            address: '01129, 서울 강북구 덕릉로 30길 9-20(미아동)2층 (계단 한 번)'
        }

        const registerResult: UserResult = await UserSerivce.register(user)
        console.log(registerResult)
    })
})