const XiaoAiError = require('./lib/XiaoAiError')
const invoke = require('./lib/invoke')

const VOLUME_STEP = 5
const baseParam = {
  method: 'player_play_operation',
  path: 'mediaplayer'
}

// 获取当前播放状态
async function getPlayStatus(ticket) {
  return invoke({
    ...baseParam,
    // 确保在 baseParam 之后，以覆盖 baseParam.method
    method: 'player_get_play_status',
    ticket
  })
}

// 设置音量
async function setVolume(ticket, volume) {
  // 边界限制，[0, 100]
  volume = Math.min(Math.max(volume, 0), 100)

  return invoke({
    ...baseParam,
    // 确保在 baseParam 之后，以覆盖 baseParam.method
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

// 继续播放
async function play(ticket) {
  return invoke({
    ...baseParam,
    message: { action: 'play', media: 'common' },
    ticket
  })
}

// 暂停播放
async function pause(ticket) {
  return invoke({
    ...baseParam,
    message: { action: 'pause', media: 'common' },
    ticket
  })
}

// 上一曲
async function prev(ticket) {
  return invoke({
    ...baseParam,
    message: { action: 'prev', media: 'common' },
    ticket
  })
}

// 下一曲
async function next(ticket) {
  return invoke({
    ...baseParam,
    message: { action: 'next', media: 'common' },
    ticket
  })
}

// 切换播放状态
async function togglePlayState(ticket) {
  return invoke({
    ...baseParam,
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
  setVolume,
  getVolume,
  volumeUp,
  volumeDown,
  getPlayStatus,
  togglePlayState
}
