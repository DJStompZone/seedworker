function sanitize(str) {
  return str.toString().substring(0, 500).replace(/[^\w\s@.-]/gi, '')
}

function escapeHtml(unsafe) {
  return unsafe.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

module.exports.escapeHtml = escapeHtml;
module.exports.sanitize = sanitize;
