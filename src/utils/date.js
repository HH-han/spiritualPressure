/**
 * 格式化日期时间
 * @param {string|number|Date} date - 需要格式化的日期
 * @param {string} [format='YYYY-MM-DD HH:mm:ss'] - 格式模板
 * @returns {string} 格式化后的日期字符串
 */
function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const pad = (n) => n.toString().padStart(2, '0')
  
  return format
    .replace(/YYYY/g, d.getFullYear())
    .replace(/MM/g, pad(d.getMonth() + 1))
    .replace(/DD/g, pad(d.getDate()))
    .replace(/HH/g, pad(d.getHours()))
    .replace(/mm/g, pad(d.getMinutes()))
    .replace(/ss/g, pad(d.getSeconds()))
}

export { formatDateTime }