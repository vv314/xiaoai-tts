function parseBigIntJson(str) {
  // If there is no big integer, Use native JSON.parse
  if (/\d{16,}/.test(str)) {
    const replaceMap = []
    let n = 0

    // extract Strings in JSON
    str = str
      .replace(/"(\\?[\s\S])*?"/g, match => {
        // remove Strings containing big integer
        if (/\d{16,}/.test(match)) {
          replaceMap.push(match)
          // Three double quotation marks never appear in vaild JSON
          return '"""'
        }

        return match
      })
      .replace(/[+\-\d.eE]{16,}/g, match => {
        if (/^\d{16,}$/.test(match)) {
          // match big integers in numbers
          return '"' + match + '"'
        }

        return match
      })
      .replace(/"""/g, function() {
        // replace Strings back
        return replaceMap[n++]
      })
  }

  return JSON.parse(str)
}

module.exports = parseBigIntJson
