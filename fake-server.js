const http = require('http')

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(200).end()
    return
  }

  if (req.method === 'POST') {
    console.log('POST request received', req.url)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: true,
      message: 'POST request received successfully',
      timestamp: new Date().toISOString(),
      url: req.url
    }))
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' })
    res.end('Method not allowed')
  }
})

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`)
})

module.exports = server
