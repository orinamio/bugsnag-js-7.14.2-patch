import Bugsnag from '@bugsnag/browser'
import config from './lib/config'

Bugsnag.start(config)

go()
  .then(function () {})
  .catch(function (e: any) {
    Bugsnag.notify(e)
  })

function go() {
  return Promise.reject(new Error('bad things'))
}
