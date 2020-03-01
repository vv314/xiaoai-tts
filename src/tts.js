const request = require('./lib/request')
const querystring = require('querystring')
const XiaoAiError = require('./XiaoAiError')
const { appendParam, randomString } = require('./lib/utils')
const { API } = require('./const')

function getReqParam(text, deviceId) {
  const param = {
    deviceId: deviceId,
    message: JSON.stringify({ text: text }),
    method: 'text_to_speech',
    path: 'mibrain',
    requestId: randomString(30)
  }

  return querystring.stringify(param)
}

function tts(ticket, text = '') {
  const param = getReqParam(text, ticket.deviceId)
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
