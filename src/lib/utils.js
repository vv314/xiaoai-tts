const { createHash, randomBytes } = require('crypto')
const parseBigIntJson = require('./parseBigIntJson')

function getHashFn(algorithm, encoding = 'hex') {
  return (data) => {
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

  const urlObj = new URL(url)
  const searchParams = new URLSearchParams(param)

  searchParams.forEach((v, k) => {
    urlObj.searchParams.append(k, v)
  })

  return urlObj.toString()
}

function serializeData(data) {
  return Object.keys(data)
    .map((key) => `${key}=${data[key]}`)
    .join('&')
}

function parseResponseText(text) {
  return parseBigIntJson(text.replace(/^&&&START&&&/, ''))
}

function randomString(length) {
  if (!Number.isFinite(length)) {
    throw new TypeError('Expected a finite number')
  }

  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

function likeDeviceId(str) {
  const re = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/gi

  return re.test(str)
}

module.exports = {
  md5: getHashFn('md5'),
  sha1Base64: getHashFn('sha1', 'base64'),
  isObject,
  getHashFn,
  appendParam,
  randomString,
  serializeData,
  parseResponseText,
  likeDeviceId
}
