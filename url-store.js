require('dotenv').config()

const fs = require('fs')
const dra = require('date-range-array')
const DIMENSIONS = ['campaign_day_breakdown', 'campaign_site_day_breakdown']
const DATE_RANGE = dra('2025-05-01', '2025-08-07')

const API_ENDPOINT = process.env.API_ENDPOINT

module.exports = {
  getNextEntry,
  updateEntry
}

function getNextEntry () {
  const status = getCurrentStatus()
  const entry = status.find(item => item.status === 'pending')
  return entry
}

function updateEntry (entry) {
  const status = getCurrentStatus()
  status.find(item => item.id === entry.id).status = 'completed'
  fs.writeFileSync('db/status.json', JSON.stringify(status, null, 2))
}

function getCurrentStatus () {
  if (!fs.existsSync('db/status.json')) {
    const initialStatus = []

    DIMENSIONS.forEach(dimension => {
      DATE_RANGE.forEach(date => {
        initialStatus.push({
          id: `${date}-${dimension}`,
          url: `${API_ENDPOINT}?dateStart=${date}&dateEnd=${date}&dimension=${dimension}`,
          status: 'pending'
        })
      })
    })

    fs.writeFileSync('db/status.json', JSON.stringify(initialStatus, null, 2))

    return initialStatus
  } else {
    return JSON.parse(fs.readFileSync('db/status.json', 'utf8'))
  }
}
