export function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, function (char) {
    switch (char) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case '"':
        return '&quot;'
      case "'":
        return '&apos;'
      default:
        return char
    }
  })
}
