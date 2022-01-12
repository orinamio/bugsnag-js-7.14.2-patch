# Express

This is an example project showing how to use `@bugsnag/js` with an Express application.

## Usage

Clone the repo and `cd` into the directory of this example:

```
git clone git@github.com:bugsnag/bugsnag-js.git
cd bugsnag-js/examples/js/express
```

Use the instructions below to run the application.

Once started, it will serve a page at http://localhost:9871 with buttons that cause the server to send various errors.

*Note that if you hit the button that crashes the server, you will need to restart it again!*

### With docker

The project includes a `Dockerfile`. If you're familiar with docker, this is the easiest way to start the example. Otherwise, skip ahead to the [without docker](#without-docker) section.

```
docker build -t bugsnag-js-example-express . && \
docker run -p 9871:9871 -it -e BUGSNAG_API_KEY='YOUR_API_KEY' bugsnag-js-example-express
```

__Note__: remember to replace `YOUR_API_KEY` in the command with your own!

### Without docker

Ensure you have a version of Node.js >=8 on your machine.

```
npm install
BUGSNAG_API_KEY=YOUR_API_KEY npm start
```

__Note__: remember to replace `YOUR_API_KEY` in the command with your own!
