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
    return loginBySession(user)
  }

  return loginByAccount(user, pwd)
}

function getCookie({
  userId = '',
  serviceToken = '',
  deviceId = '',
  serialNumber = ''
}) {
  let cookie = `userId=${userId};serviceToken=${serviceToken}`

  if (deviceId && serialNumber) {
    cookie += `;deviceId=${deviceId};sn=${serialNumber}`
  }

  return cookie
}

async function getLoginSign() {
  const info = await request({
    url: API.SERVICE_LOGIN,
    type: 'text',
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
    type: 'text',
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
  const session = {
    serviceToken: serviceToken,
    userId: authInfo.userId
  }

  session['cookie'] = getCookie(session)

  return session
}

async function loginBySession(session) {
  const keys = ['userId', 'serviceToken', 'serialNumber', 'deviceId']
  const hasVal = k => Boolean(session[k])

  if (!keys.every(hasVal)) {
    throw new XiaoAiError(ERR_CODE.AURH_ERR)
  }

  session['cookie'] = getCookie(session)

  return session
}

login.switchSessionDevice = (session, device) => {
  // 确保总是返回一个新对象
  const newSesstion = Object.assign({}, session, {
    deviceId: device.deviceID,
    serialNumber: device.serialNumber
  })

  newSesstion['cookie'] = getCookie(newSesstion)

  return newSesstion
}

module.exports = login
