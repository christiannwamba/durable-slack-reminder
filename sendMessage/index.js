/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 *
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */

const axios = require('axios');
module.exports = async function(context) {
  try {
    context.log('Starting request');
    await axios({
      method: 'post',
      url: process.env['SLACK_WEBHOOK_URL'],
      headers: {
        'Content-type': 'application/json'
      },
      data: {
        text: context.bindings.name.text
      }
    });
    return `Hello ${context.bindings.name.text}!`;
  } catch (err) {
    context.log(err);
  }
};
