const { http } = require('@serverless-devs/dk')

const handler = http.onRequest({
  handler: (request) => {
    console.log(request)
    return {
      body: 'hello world',
    }
  },
})

exports.handler = handler
