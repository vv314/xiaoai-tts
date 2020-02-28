const querystring = require('querystring')
const XiaoAiError = require('./XiaoAiError')
const request = require('./request')
const { appendParam, randomString } = require('./utils')
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

function tts(msg, { cookie, deviceId }) {
  const param = getReqParam(msg, deviceId)
  const url = appendParam(API.USBS, param)

  return request({
    url,
    method: 'POST',
    headers: {
      Cookie: cookie
    }
  }).catch(e => {
    throw new XiaoAiError(e)
  })
}

module.exports = tts
