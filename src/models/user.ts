export type User = {
    userSeqNo?: number
    userId?: string
    password?: string
    name?: string
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
    name?: string
    userInfo?: string
    userGender?: string
    dupInfo?: string
    userCellNo?: string
}

export type SessionUser = {
    userId: string,
    name: string,
    userInfo: string,
    userCellNo: string,
    userEmail: string
}