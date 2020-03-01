const { createHash, randomBytes } = require('crypto')

function getHashFn(algorithm, encoding = 'hex') {
  return data => {
    const hash = createHash(algorithm)

    if (isObject(data)) {
      data = JSON.stringify(data)
    }

    return hash.update(data).digest(encoding)
  }
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

function appendParam(url = '', param) {
  if (!url) return ''
  if (!param) return url

  url = url.replace(/[?&]$/, '')
  return /\?/.test(url) ? `${url}&${param}` : `${url}?${param}`
}

function serializeData(data) {
  return Object.keys(data)
    .map(key => `${key}=${data[key]}`)
    .join('&')
}

function parseResponseText(text) {
  return parseJson(text.replace(/^&&&START&&&/, ''))
}

function randomString(length) {
  if (!Number.isFinite(length)) {
    throw new TypeError('Expected a finite number')
  }

  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

function parseJson(str) {
  let data

  try {
    data = JSON.parse(
      // 将大数字转为 string, 避免精度丢失
      str.replace(/([\\[:])?(\d+)([,\\}\]])/g, '$1"$2"$3')
    )
  } catch (e) {
    data = JSON.parse(str)
  }

  return data
}

module.exports = {
  md5: getHashFn('md5'),
  sha1Base64: getHashFn('sha1', 'base64'),
  isObject,
  getHashFn,
  parseJson,
  appendParam,
  randomString,
  serializeData,
  parseResponseText
}
