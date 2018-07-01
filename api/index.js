const express = require('express')

// Create express instnace
const app = express()

// Require API routes
const schedulers = require('./routes/schedulers')

// Import API Routes
app.use(schedulers)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
