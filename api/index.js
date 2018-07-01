const express = require('express')
const bodyParser = require('body-parser')

// Create express instnace
const app = express()

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Require API routes
const schedulers = require('./routes/schedulers')

// Import API Routes
app.use(schedulers)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
