/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 *
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *    function app in Kudu
 */

const df = require('durable-functions');
const moment = require('moment-timezone');
const chrono = require('chrono-node');

module.exports = df.orchestrator(function*(context) {
  const input = context.df.getInput();

  const naturalLanguage = input.text;
  const timeZone = input.timeZone;
  const parsedDate = chrono.parseDate(naturalLanguage);

  const remindAt = moment(parsedDate)
    .tz(timeZone)
    .format();

  yield context.df.createTimer(new Date(remindAt));

  const message = {
    text: `You scheduled *${naturalLanguage}* to happen now`
  };
  return yield context.df.callActivity('sendMessage', message);
});
