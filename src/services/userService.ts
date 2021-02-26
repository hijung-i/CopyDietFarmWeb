import { User } from '../models/user'
import * as request from 'request-promise-native'
import { setUserResult, StatusCode, StatusMessage, UserResult } from '../models/response'
import { Request } from 'express'

const serverUrl = 'http://192.168.0.3:9090'

type Option = {
    uri: string,
    method: string,
    headers?: {},
    json: boolean,
    body?: Object
}

class UserService {
    login = async (user: User): Promise<UserResult> => {
        let options: Option = {
            uri: `${serverUrl}/user/login`,
            method: 'POST',
            headers: {
                'Accept-Charset': 'application/json; charset=UTF-8',
                'Content-Type': 'application/json'
            },
            json: true,
            body: user
        }

        return request(options).then((res: any): UserResult => {
            return setUserResult(StatusCode.success, StatusMessage.success, res.result)
        }).catch((err: any): UserResult => {
            if (err) {
                console.log('Error occured while login', err.statusCode, err.error)
            }
            return setUserResult(StatusCode.error, err.error, null)
        })
    }

}
export default new UserService()
