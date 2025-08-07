const axios = require('axios')
const cron = require('node-cron')

const { writeLog } = require('./logger')
const { getNextEntry, updateEntry } = require('./url-store')

scheduleRequests()

function scheduleRequests () {
  const cronExpression = createCronExpression()

  const task = cron.schedule(cronExpression, async () => {
    console.log('Running cron job at:', new Date().toLocaleString())
    const entry = getNextEntry()
    try {
      console.log('Making API request to:', entry.url)
      const response = await makeApiRequest(entry.url)
      writeLog(entry.url, response)
      updateEntry(entry)
      console.log('API request completed successfully')
    } catch (error) {
      writeLog(entry.url, null, error)
      console.error(error.message)
    }
  }, {
    scheduled: true,
    timezone: 'America/Los_Angeles'
  })

  return task
}

async function makeApiRequest (url) {
  const response = await axios.post(url, {}, {
    timeout: 120 * 1000, // 2 minutes
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'BackfillStrategis/1.0.0 (Node.js)',
      Accept: 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache'
    }
  })

  return response
}

function createCronExpression () {
  const allowedMinutes = [
    14, 16, 18, 24, 28, 34, 36, 38, 42, 44, 46, 48, 51, 53, 54, 58
  ]
  const sortedMinutes = [...allowedMinutes].sort((a, b) => a - b)
  return `${sortedMinutes.join(',')} * * * *`
}

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))
