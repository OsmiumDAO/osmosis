const toHex = (str) => {
  var arr1 = []
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16).padStart(2, '0').substring(0, 2)
    arr1.push(hex)
  }
  return arr1.join('')
}

const isHex = (str) => {
  const regexp = /^[0-9a-fA-F]+$/
  return regexp.test(str)
}

export { toHex, isHex }
