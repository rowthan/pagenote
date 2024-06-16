export function getMb(byte: number) {
  const byteNumber = byte || 0
  if (byteNumber < 1024 * 1024) {
    return (byteNumber / 1024).toFixed(0) + 'kb'
  }
  if( byteNumber > 1024 * 1024 * 1024){
    return (byteNumber / 1024 / 1024 / 1024).toFixed(1) + 'Gb'
  }
  return (byteNumber / 1024 / 1024).toFixed(1) + 'Mb'
}
