const invoke = require('../lib/invoke')
const { API } = require('../const')

async function getSongInfo(ticket, songId) {
  return await invoke({
    cookie: ticket.cookie,
    url: API.SONG_INFO,
    data: {
      songId: songId
    }
  })
}

module.exports = getSongInfo
