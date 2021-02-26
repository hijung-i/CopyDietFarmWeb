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

}

export type SessionUser = {
    userId: string,
    name: string,
    userInfo: string,
    userCellNo: string,
    userEmail: string
}