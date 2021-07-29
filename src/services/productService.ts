import { User } from '../models/user'
import * as request from 'request-promise-native'
import * as winston from '../configs/winston'
import { current } from '../configs/url'
import * as axiosModule from 'axios'

import { setUserResult, StatusCode, StatusMessage, UserResult } from '../models/response'

const STREAM = winston.stream
const axios = axiosModule.default

class ProductService {
    private SERVER_URL = current.API_SERVER

    getProductDetail = async (param: User): Promise<axiosModule.AxiosResponse> => {
        return axios.post(this.SERVER_URL + '/product/getProductDetail', param)
        .then(async (data) => {
            return data.data.result
        }).catch(async (err) => {
            console.log(err)
            STREAM.writeError('ProductService.getProductDetail -> ', JSON.stringify(err))
            return err
        })
    }

}
export default new ProductService()
