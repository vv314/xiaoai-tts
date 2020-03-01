const request = require('./lib/request')
const XiaoAiError = require('./lib/XiaoAiError')
const { randomString } = require('./lib/utils')
const { getStatus } = require('./mediaPlayer')
const { API } = require('./const')

async function getSongInfo(ticket, songId) {
  if (!songId) {
    const status = await getStatus(ticket)

    songId = status.play_song_detail.global_id

    if (!songId) return null
  }

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

  if (rep.code != 0) {
    throw new XiaoAiError(rep.code, rep.message)
  }

  return rep.data
}

module.exports = getSongInfo
