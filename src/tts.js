const request = require('./lib/request')
const querystring = require('querystring')
const XiaoAiError = require('./XiaoAiError')
const { appendParam, randomString } = require('./lib/utils')
const { API } = require('./const')

function getReqParam(msg, deviceId) {
  const param = {
    deviceId: deviceId,
    message: JSON.stringify({ text: msg }),
    method: 'text_to_speech',
    path: 'mibrain',
    requestId: randomString(30)
  }

  return querystring.stringify(param)
}

function tts(ticket, msg) {
  const param = getReqParam(msg, ticket.deviceId)
  const url = appendParam(API.USBS, param)

  return request({
    url,
    method: 'POST',
    headers: {
      Cookie: ticket.cookie
    }
  }).catch(e => {
    throw new XiaoAiError(e)
  })
}

module.exports = tts
