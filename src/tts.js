const invoke = require('./lib/invoke')

function tts(ticket, text = '') {
  return invoke({
    method: 'text_to_speech',
    message: { text },
    path: 'mibrain',
    ticket
  })
}

module.exports = tts
