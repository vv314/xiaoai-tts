const querystring = require('querystring')
const XiaoAiError = require('./XiaoAiError')
const request = require('./request')
const { API } = require('../const')
const { appendParam, randomString } = require('./utils')
const { ERR_CODE } = XiaoAiError

async function invoke({ url, data = {}, method = 'GET', cookie }) {
  const rep = await request({
    url,
    method,
    data: {
      ...data,
      requestId: randomString(30)
    },
    headers: {
      Cookie: cookie
    }
  }).catch((e) => {
    throw new XiaoAiError(e)
  })

  // console.log({ url, data, cookie }, '\n')

  if (rep.code != 0) {
    console.log('err rep', rep)
    throw new XiaoAiError(ERR_CODE.INVALID_RESULT, rep)
  }

  return rep.data
}

async function ubus(ticket = {}, { method = '', message = {}, path = '' }) {
  if (Object.keys(message)) {
    message = { ...message, media: 'app_ios' }
  }

  const param = {
    deviceId: ticket.deviceId,
    message: JSON.stringify(message),
    method: method,
    path: path,
    requestId: `app_ios_${randomString(30)}`
  }

  console.log('[ubus]', param)

  const url = appendParam(API.USBS, param)

  return invoke({ url, method: 'POST', cookie: ticket.cookie }).catch((e) => {
    const rep = e.response
    const hasRepError = rep && rep.code == 100 && rep.data && rep.data.msg

    // 处理 ubus 错误
    if (hasRepError) {
      const msg = JSON.parse(rep.data.msg)

      throw new XiaoAiError(ERR_CODE.UBUS_ERR, msg.msg)
    }

    throw e
  })
}

invoke.ubus = ubus

module.exports = invoke
