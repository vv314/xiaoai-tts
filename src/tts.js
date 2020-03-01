const invoke = require('./lib/invoke')
const { parseJson } = require('./lib/utils')

async function tts(ticket, text = '') {
  const data = await invoke({
    method: 'text_to_speech',
    // 确保 text 为 string
    message: { text: `${text}` },
    path: 'mibrain',
    ticket
  })

  return parseJson(data.info)
}

module.exports = tts
