const df = require('durable-functions');
const axios = require('axios');
var qs = require('querystring');
const signature = require('../lib/verifySignature');

module.exports = async function(context, req) {
  context.log('headers', req.headers);
  context.log('rawBody', req.rawBody);
  context.log('body', req.body);
  req.body = qs.parse(req.body);
  //   if (!signature.isVerified(req)) {
  //     return handleUnVerifiedRequest(context);
  //   }

  const client = df.getClient(context);
  const accessToken = process.env['SLACK_ACCESS_TOKEN'];
  const userResponse = await axios.get(
    `https://slack.com/api/users.info?token=${accessToken}&user=${req.body.user_id}`
  );
  const userTimeZone = userResponse.data.user.tz;

  context.log('timezone>>>>>>>', userTimeZone);

  const instanceId = await client.startNew(
    req.params.functionName,
    undefined,
    Object.assign(req.body, { timeZone: userTimeZone })
  );
  context.log(`Started orchestration with ID = '${instanceId}'.`);

  const timerStatus = client.createCheckStatusResponse(
    context.bindingData.req,
    instanceId
  );

  context.log(timerStatus);

  return {
    response_type: 'in_channel',
    text: `*${req.body.text}* has been scheduled`,
    timerStatus
  };
};

function handleUnVerifiedRequest(context) {
  return (context.res = {
    headers: {
      'Content-Type': 'application/json'
    },
    status: 401,
    body: {
      message: 'getout'
    }
  });
}
