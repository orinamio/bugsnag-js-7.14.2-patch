var Bugsnag = require('@bugsnag/node')
Bugsnag.start({
  apiKey: process.env.BUGSNAG_API_KEY,
  endpoints: {
    notify: process.env.BUGSNAG_NOTIFY_ENDPOINT,
    sessions: process.env.BUGSNAG_SESSIONS_ENDPOINT
  },
  autoDetectErrors: false
})

Promise.reject(new Error('not handled'))
