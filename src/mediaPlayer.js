const request = require('./lib/request')
const querystring = require('querystring')
const XiaoAiError = require('./XiaoAiError')
const { appendParam, randomString } = require('./lib/utils')
const { API } = require('./const')

const VOLUME_STEP = 5

async function invoke({
  method = 'player_play_operation',
  message = {},
  ticket
}) {
  const param = {
    deviceId: ticket.deviceId,
    message: JSON.stringify(message),
    method: method,
    path: 'mediaplayer',
    requestId: randomString(30)
  }

  const url = appendParam(API.USBS, querystring.stringify(param))

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

async function getPlayStatus(ticket) {
  return invoke({
    method: 'player_get_play_status',
    ticket
  })
}

// 设置音量
async function setVolume(ticket, volume) {
  // 边界限制，[0, 100]
  volume = Math.max(volume, 0)
  volume = Math.min(volume, 100)

  return invoke({
    method: 'player_set_volume',
    message: { volume },
    ticket
  })
}

// 获取音量
async function getVolume(ticket) {
  const res = await getPlayStatus(ticket)

  if (res.code != 0) {
    throw new XiaoAiError(res.code, res.message)
  }

  return JSON.parse(res.data.info).volume
}

// 播放
async function play(ticket) {
  return invoke({
    message: { action: 'play', media: 'common' },
    ticket
  })
}

// 暂停
async function pause(ticket) {
  return invoke({
    message: { action: 'pause', media: 'common' },
    ticket
  })
}

// 上一曲
async function prev(ticket) {
  return invoke({
    message: { action: 'prev', media: 'common' },
    ticket
  })
}

// 下一曲
async function next(ticket) {
  return invoke({
    message: { action: 'next', media: 'common' },
    ticket
  })
}

// 切换
async function toggle(ticket) {
  return invoke({
    message: { action: 'toggle', media: 'common' },
    ticket
  })
}

// 调大声音
async function volumeUp(ticket) {
  const volume = await getVolume(ticket)

  return setVolume(ticket, volume + VOLUME_STEP)
}

// 调小声音
async function volumeDown(ticket) {
  const volume = await getVolume(ticket)

  return setVolume(ticket, volume - VOLUME_STEP)
}

module.exports = {
  play,
  pause,
  prev,
  next,
  toggle,
  setVolume,
  getVolume,
  volumeUp,
  volumeDown
}
