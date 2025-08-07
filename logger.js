const fs = require('fs')
const path = require('path')

const logsDir = path.join(__dirname, 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

function writeLog (url, response, error = null) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    url,
    status: response?.status || null,
    error: error?.message || null,
    success: !error,
    response: response?.data || null
  }

  const logLine = JSON.stringify(logEntry) + '\n'
  const logFile = path.join(logsDir, `api-requests-${new Date().toISOString().split('T')[0]}.log`)

  fs.appendFileSync(logFile, logLine)
}

module.exports = { writeLog }
