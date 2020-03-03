const invoke = require('../lib/invoke')
const { getStatus } = require('./getStatus')
const { API } = require('../const')

async function getSongInfo(ticket, songId) {
  if (!songId) {
    const status = await getStatus(ticket)

    songId = status.play_song_detail.global_id

    if (!songId) return null
  }

  return await invoke({
    cookie: ticket.cookie,
    url: API.SONG_INFO,
    data: {
      songId: songId
    }
  })
}

module.exports = getSongInfo
