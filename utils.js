function debug(obj) {
  return `<pre><code>${JSON.stringify(obj, null, 2)}</code></pre>`
}

module.exports = {
  debug
}