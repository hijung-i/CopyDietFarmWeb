/*************************************
 * API_SERVER: API server url
 * CALLBACK_SERVER: Web server url
 * @member PROD : AWS
 * @member DEV_UBUNTU
 * @member DEV_JGPARK for local test jgpark
 *************************************/
export type ServerInfo = {
    API_SERVER: string,
    CALLBACK_SERVER: string
}

const PROD: ServerInfo = {
    API_SERVER: 'https://dietfarm119.co.kr',
    CALLBACK_SERVER: 'https://dietfarm.co.kr'
}

const DEV_JGPARK: ServerInfo = {
    API_SERVER: 'http://192.168.0.3:9090',
    CALLBACK_SERVER: 'http://192.168.0.3'
}
const DEV_UBUNTU: ServerInfo = {
    API_SERVER: 'http://112.217.209.162:9090',
    CALLBACK_SERVER: 'http://localhost'
}

export const current = DEV_JGPARK