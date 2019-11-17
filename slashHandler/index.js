const df = require('durable-functions');
const signature = require('../lib/verifySignature');

module.exports = async function(context, req) {
  context.log('headers', req.headers);
  context.log('rawBody', req.rawBody);
  context.log('body', req.body)

//   if (!signature.isVerified(req)) {
//     return handleUnVerifiedRequest(context);
//   }

  const client = df.getClient(context);
  const instanceId = await client.startNew(
    req.params.functionName,
    undefined,
    req.body
  );
  context.log(`Started orchestration with ID = '${instanceId}'.`);

  return client.createCheckStatusResponse(context.bindingData.req, instanceId);
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
