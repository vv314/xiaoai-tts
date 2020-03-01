const request = require('./lib/request')
const { md5, sha1Base64, isObject } = require('./lib/utils')
const { SDK_VER, API, APP_DEVICE_ID } = require('./const')
const XiaoAiError = require('./lib/XiaoAiError')
const { ERR_CODE } = XiaoAiError

const commonParam = {
  sid: 'micoapi',
  _json: true
}

async function login(user, pwd) {
  if (isObject(user)) {
    return loginByToken(user)
  }

  return loginByAccount(user, pwd)
}

function getCookie(userId, serviceToken) {
  return `userId=${userId};serviceToken=${serviceToken}`
}

async function getLoginSign() {
  const info = await request({
    url: API.SERVICE_LOGIN,
    type: 'xiaoai',
    data: commonParam
  })

  return { _sign: info._sign, qs: info.qs }
}

async function serviceAuth(signData, user, pwd) {
  const data = {
    user,
    hash: md5(pwd).toUpperCase(),
    callback: 'https://api.mina.mi.com/sts',
    ...commonParam,
    ...signData
  }
  const AuthInfo = await request({
    url: API.SERVICE_AUTH,
    method: 'post',
    type: 'xiaoai',
    data: data,
    headers: {
      Cookie: `deviceId=${APP_DEVICE_ID};sdkVersion=${SDK_VER}`
    }
  })

  return AuthInfo
}

async function loginMiAi(authInfo) {
  const clientSign = genClientSign(authInfo.nonce, authInfo.ssecurity)

  const rep = await request({
    url: authInfo.location,
    data: {
      clientSign
    },
    type: 'raw'
  }).catch(e => {
    throw new XiaoAiError(e)
  })
  const cookieStr = rep.headers.get('set-cookie') || ''
  const match = cookieStr.match(/serviceToken=(.*?);/)

  return match ? match[1] : ''
}

function genClientSign(nonce, secrity) {
  const str = `nonce=${nonce}&${secrity}`
  const hashStr = sha1Base64(str)

  return hashStr
}

async function loginByAccount(user, pwd) {
  if (!user || !pwd) {
    throw new XiaoAiError(ERR_CODE.INVALID_INPUT)
  }

  const sign = await getLoginSign()
  const authInfo = await serviceAuth(sign, user, pwd)

  if (authInfo.code != 0) {
    throw new XiaoAiError(authInfo.code, authInfo.desc)
  }

  const serviceToken = await loginMiAi(authInfo)

  return {
    userId: authInfo.userId,
    serviceToken: serviceToken,
    cookie: getCookie(authInfo.userId, serviceToken)
  }
}

async function loginByToken(user) {
  const { userId, serviceToken } = user

  if (!userId || !serviceToken) {
    throw new XiaoAiError(ERR_CODE.INVALID_INPUT)
  }

  return {
    userId: userId,
    serviceToken: serviceToken,
    cookie: getCookie(userId, serviceToken)
  }
}

login.getCookie = getCookie

module.exports = login
