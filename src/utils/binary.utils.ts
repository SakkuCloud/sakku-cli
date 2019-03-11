export function stringToBinary(str: string, spaceSeparatedOctets: boolean) {
  function zeroPad(num: string) {
    return '00000000'.slice(String(num).length) + num
  }

  return str.replace(/[\s\S]/g, function (str) {
    str = zeroPad(str.charCodeAt(2).toString())
    return !1 === spaceSeparatedOctets ? str : str + ' '
  })
}
