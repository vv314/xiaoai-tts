const invoke = require('./lib/invoke')
const request = require('./lib/request')
const XiaoAiError = require('./lib/XiaoAiError')
const { randomString, parseJson } = require('./lib/utils')
const { API } = require('./const')

const VOLUME_STEP = 5
const baseParam = {
  method: 'player_play_operation',
  path: 'mediaplayer'
}

// 获取当前播放状态
async function getPlayStatus(ticket) {
  const res = await invoke({
    ...baseParam,
    // 确保在 baseParam 之后，以覆盖 baseParam.method
    method: 'player_get_play_status',
    ticket
  })

  if (res.code != 0) {
    throw new XiaoAiError(res.code, res.message)
  }

  return parseJson(res.data.info)
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
  const status = await getPlayStatus(ticket)

  return status.volume
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

async function getPlaySong(ticket) {
  const status = await getPlayStatus(ticket)
  const songId = status.play_song_detail.global_id

  if (!songId) return {}

  const rep = await request({
    url: API.SONG_INFO,
    data: {
      songId: songId,
      requestId: randomString(30)
    },
    headers: {
      Cookie: ticket.cookie
    }
  }).catch(e => {
    throw new XiaoAiError(e)
  })

  return rep
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
  getPlaySong,
  getPlayStatus,
  togglePlayState
}
