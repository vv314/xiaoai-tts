const request = require('./request')
const { SDK_VER, API, APP_DEVICE_ID } = require('./const')
const { md5, sha1Base64, isObject } = require('./utils')

const commonParam = {
  sid: 'micoapi',
  _json: true
}

function getAiCookie(userId, serviceToken) {
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
    if (e.rep.status == 401) {
      console.log('权限验证失败')
    }
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

async function login(user, pwd) {
  if (isObject(user)) {
    const { userId, serviceToken } = user
    const cookie = getAiCookie(userId, serviceToken)

    return {
      cookie: cookie,
      userId: userId,
      serviceToken
    }
  }

  const sign = await getLoginSign()
  const authInfo = await serviceAuth(sign, user, pwd)
  const serviceToken = await loginMiAi(authInfo)
  const cookie = getAiCookie(authInfo.userId, serviceToken)

  return {
    cookie: cookie,
    userId: authInfo.userId,
    serviceToken
  }
}

login.getAiCookie = getAiCookie

module.exports = login
