const fetch = require('node-fetch')
const { appendParam, parseResponseText } = require('./utils')
const { MINA_UA, APP_UA } = require('../const')

class HttpError extends Error {
  constructor(rep) {
    super()

    this.status = rep.status
    this.statusText = rep.statusText
    this.response = rep.response

    this.message = [
      'Request Error',
      `url: ${rep.url}`,
      `status: ${rep.status}`,
      `response: ${rep.response}`
    ].join('\n')
    this.message += '\n'
  }
}

function request({
  url = '',
  method = 'GET',
  data = '',
  type = 'json',
  headers = {}
}) {
  method = typeof method === 'string' ? method.toUpperCase() : 'GET'
  const contentType =
    method == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json'

  const options = {
    method: method,
    headers: Object.assign(
      {
        'Content-Type': contentType,
        Connection: 'keep-alive',
        'User-Agent': url.includes('mina.mi.com') ? MINA_UA : APP_UA,
        Accept: '*/*'
      },
      headers
    )
  }

  if (method === 'GET') {
    url = appendParam(url, data)
  } else if (method === 'POST') {
    const contentType = options.headers['Content-Type'] || ''
    let body

    if (contentType.indexOf('application/json') > -1) {
      body = typeof data === 'string' ? data : JSON.stringify(data)
    } else {
      body = new URLSearchParams(data || {}).toString()
      options.headers['Content-Length'] = body.length
    }

    if (body) {
      options.body = body
    }
  }

  return fetch(url, options).then(async (rep) => {
    if (rep.status == 200) {
      switch (type) {
        case 'raw':
          return rep
        case 'json':
          return rep.text().then(parseResponseText)
        default:
          return rep.text()
      }
    }

    throw new HttpError({
      url,
      response: await rep.text(),
      status: rep.status,
      statusText: rep.statusText
    })
  })
}

module.exports = request
