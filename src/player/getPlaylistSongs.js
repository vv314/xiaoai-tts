const invoke = require('../lib/invoke')
const { API } = require('../const')

async function getPlaylistSongs(
  ticket,
  { listId, count = 20, offset = 0 } = {}
) {
  return invoke({
    url: API.PLAYLIST_SONGS,
    data: {
      listId,
      count,
      offset
    },
    cookie: ticket.cookie
  })
}

module.exports = getPlaylistSongs
