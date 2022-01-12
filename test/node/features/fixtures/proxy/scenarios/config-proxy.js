var Bugsnag = require('@bugsnag/node')
var ProxyAgent = require('http-proxy-agent')
Bugsnag.start({
  apiKey: process.env.BUGSNAG_API_KEY,
  endpoints: {
    notify: process.env.BUGSNAG_NOTIFY_ENDPOINT,
    sessions: process.env.BUGSNAG_SESSIONS_ENDPOINT
  },
  agent: new ProxyAgent('http://corporate-proxy:3128')
})
Bugsnag.notify(new Error('hi via proxy'))
