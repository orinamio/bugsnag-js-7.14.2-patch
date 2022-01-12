# @bugsnag/plugin-simple-throttle

This plugin adds a safety mechanism to prevent too many events being sent to Bugsnag, saving client bandwidth and error quotas using a simple threshold – i.e. do not send more than `n` events. It defines a configuration option `maxEvents` which can be used to customize the behaviour. It is included in the browser notifier.

**Note:** to support long-lived browser applications, this plugin defines a `resetEventCount()` method on the client which gets called when the URL of the page changes. This resets the count, allowing new events to be sent.

## License

This package is free software released under the MIT License. See [LICENSE.txt](./LICENSE.txt) for details.
