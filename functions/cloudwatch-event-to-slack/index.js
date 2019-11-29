'use strict';
const url = require('url');
const https = require('https');

exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event))
  let payload = {
    channel: process.env.SLACK_CHANNEL,
    fields: [
  		{
  			title: event.source,
  			value: '```' + JSON.stringify(event.detail, null, 2) + '```',
  			short: false,
  		}
  	]
  };
  
  if ('aws.codepipeline' == event.source) {
    payload.color = 'SUCCEEDED' == event.detail.state ? 'good' : 'danger'
  } else if ('aws.codebuild' == event.source) {
    payload.fields[0].value = '```' + JSON.stringify({
      project: event.detail['project-name'],
      state: event.detail['build-status'],
      version: event.detail['additional-information']['source-version']
    }, null, 2) + '```'
    payload.color = 'SUCCEEDED' == event.detail['build-status'] ? 'good' : 'danger'
  }
  
  payload = JSON.stringify(payload);

  const options = url.parse(process.env.SLACK_HOOK_URL);
  options.method = 'POST';
  options.headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
  };

  const req = https.request(options, res => {
    console.log({
      code: res.statusCode,
      message: res.statusMessage,
    })
  })

  req.on('error', (e) => {
    console.error(e);
  });
  req.write(payload);
  req.end();
};
