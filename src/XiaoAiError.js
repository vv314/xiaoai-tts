const C = {
  AURH_ERR: 401,
  INVALID_ARG: 1,
  NO_DEVICE: 2
}

const errCodeMap = {
  [C.AURH_ERR]: 'Session 校验失败，请重新登录',
  [C.NO_DEVICE]: '未找到在线设备，请检查音箱网络连接',
  [C.INVALID_ARG]: '参数不合法，请查阅文档'
}

function isHttpError(e) {
  return e instanceof Error && e.constructor.name === 'HttpError'
}

function getHttpErrMsg(err) {
  const { status, statusText } = err

  if (status in errCodeMap) {
    return errCodeMap[status]
  }

  return `网络错误 (${status}: ${statusText})`
}

class XiaoAiError extends Error {
  constructor(code, errMsg = '') {
    super()

    let message = ''

    if (isHttpError(code)) {
      this.type = 'network'

      message = getHttpErrMsg(code)
    } else {
      this.type = 'runtime'

      message = errCodeMap[code] || ''
    }

    this.message = message + errMsg + '\n'
  }
}

XiaoAiError.ERR_CODE = C

module.exports = XiaoAiError
