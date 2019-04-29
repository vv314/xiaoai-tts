const querystring = require('querystring')
const request = require('./request')
const { appendParam, randomString } = require('./utils')
const { API } = require('./const')

function tts(msg, { cookie, deviceId }) {
  const param = {
    deviceId: deviceId,
    message: JSON.stringify({ text: msg }),
    method: 'text_to_speech',
    path: 'mibrain',
    requestId: randomString(30)
  }
  const url = appendParam(API.USBS, querystring.stringify(param))

  return request({
    url,
    method: 'POST',
    headers: {
      Cookie: cookie
    }
  })
}

module.exports = tts
