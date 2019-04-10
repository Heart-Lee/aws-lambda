'use strict'
const url = require('url')
const https = require('https')

/**
 * Envs
 * - SLACK_CHANNEL
 * - SLACK_HOOK_URL
 */
exports.handler = (event, context, callback) => {
  let payload = {
    channel: process.env.SLACK_CHANNEL,
    fields: [
  		{
  			title: event.source,
  			value: '```' + JSON.stringify(event.detail, null, 2) + '```',
  			short: false,
  		}
  	]
  }
  
  if ('aws.codepipeline' == event.source) {
    payload.color = 'SUCCEEDED' == event.detail.state ? 'good' : 'danger'
  }
  
  payload = JSON.stringify(payload)

  const options = url.parse(process.env.SLACK_HOOK_URL)
  options.method = 'POST'
  options.headers = {
      'Content-Type': 'application/json',
      'Content-Length': payload.length,
  }

  const req = https.request(options, res => {
    console.log({
      code: res.statusCode,
      message: res.statusMessage,
    })
  })

  req.on('error', (e) => {
    console.error(e)
  })
  
  req.write(payload)
  req.end()
};
