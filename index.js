const aws = require('aws-sdk');
aws.config.update({region: 'us-west-2'});
const sns = new aws.SNS()

exports.handler = async function(event, context) {
  const params = {
    Message: 'Hello World! Charles',
    Subject: 'SNS Notification from Lambda',
    TopicArn: process.env.SNS_TOPIC_ARN
  };
  try {
    await sns.publish(params).promise()
    return { statusCode: 200, body: 'Message sent' };
  } catch(err) {
    return { statusCode: 500, body: JSON.stringify(err) };
  }
};
