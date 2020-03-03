const C = {
  AURH_ERR: 401,
  INVALID_INPUT: 1,
  NO_DEVICE: 2,
  UBUS_ERR: 3,
  INVALID_RESULT: 4
}

const errCodeMap = {
  [C.AURH_ERR]: 'Session 校验失败，请重新登录',
  [C.NO_DEVICE]: '未找到在线设备，请检查设备连接',
  [C.INVALID_INPUT]: '参数不合法，请查阅文档',
  [C.INVALID_RESULT]: '接口错误',
  [C.UBUS_ERR]: '请检查设备连接'
}

function isHttpError(e) {
  return e instanceof Error && e.constructor.name === 'HttpError'
}

class XiaoAiError extends Error {
  constructor(code, errMsg = '') {
    super()

    let message = ''

    if (isHttpError(code)) {
      // http 请求错误
      this.type = 'fetch'

      errMsg = code.message + '\n' + code.statusText
      message = '网络请求错误'
    } else if (code == C.INVALID_RESULT) {
      // 服务端响应错误
      this.type = 'response'
      this.response = errMsg

      message = errCodeMap[code]
    } else {
      // 运行时错误
      this.type = 'runtime'

      message = errCodeMap[code] || ''
    }

    errMsg = typeof errMsg == 'object' ? JSON.stringify(errMsg) : errMsg

    this.message = errMsg ? `${errMsg} - ${message}` : message
    this.message += '\n'
  }
}

XiaoAiError.ERR_CODE = C

module.exports = XiaoAiError
