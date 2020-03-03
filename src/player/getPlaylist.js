const invoke = require('../lib/invoke')
const { API } = require('../const')

async function getPlaylist(ticket) {
  return invoke({
    url: API.PLAYLIST,
    cookie: ticket.cookie
  })
}

module.exports = getPlaylist
