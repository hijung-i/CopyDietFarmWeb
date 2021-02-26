import { User } from './user'

export enum StatusCode {
    success     = 200,
    error       = 500
}

export enum StatusMessage {
    success     = 'SUCCESS',
    error       = 'ERROR_SERVER',
    notFound    = 'NOT_FOUND'
}

export type UserResult = {
    statusCode: number,
    message: string,
    data?: User | null
}

export const setUserResult = (statusCode: number, message: string, data?: User | null): UserResult => {
    return {
        statusCode: statusCode,
        message: message,
        data: data
    }
}