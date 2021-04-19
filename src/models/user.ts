export type User = {
    userSeqNo?: number
    userId?: string
    password?: string
    userName?: string
    userInfo?: string
    userCellNo?: string
    userEmail?: string
    regDate?: string
    authId?: string
    registrationtokens?: string
    dupInfo?: string
    serviceAlert?: string
    marketingAlert?: string
    userGender?: string

}

export type NiceUser = {
    userName?: string
    userInfo?: string
    userGender?: string
    dupInfo?: string
    userCellNo?: string
}

export type SessionUser = {
    userId: string,
    userName: string,
    userInfo: string,
    userCellNo: string,
    userEmail: string
}