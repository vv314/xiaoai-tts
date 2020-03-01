const querystring = require('querystring')
const XiaoAiError = require('./XiaoAiError')
const request = require('./request')
const { API } = require('../const')
const { appendParam, randomString } = require('./utils')

async function invoke({ method = '', message = {}, path = '', ticket = {} }) {
  const param = {
    message: JSON.stringify(message),
    requestId: randomString(30),
    deviceId: ticket.deviceId,
    method: method,
    path: path
  }

  const url = appendParam(API.USBS, querystring.stringify(param))

  // console.log(param)
  // console.log(ticket.cookie)

  const rep = await request({
    url,
    method: 'POST',
    headers: {
      Cookie: ticket.cookie
    }
  }).catch(e => {
    throw new XiaoAiError(e)
  })

  if (rep.code != 0) {
    throw new XiaoAiError(rep.code, rep.message)
  }

  return rep.data
}

module.exports = invoke
