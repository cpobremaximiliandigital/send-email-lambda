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

exports.sendEmail = async function(event, context) {
  console.log("Handling email to", event);

  if(!event.email.match(/^[^@]+@[^@]+$/)) {
    console.log("Not sending: invalid email address", event);
    context.done(null, "Failed");
    return;
  }

  const name = event.name.substr(0, 40).replace(/[^\w\s]/g, '');

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <p>Hi ${name},</p>
        <p>I'm sending you an email just to test this function.</p>
      </body>
    </html>
  `;

  const textBody = `
    Hi ${name},

    I'm sending you an email just to test this function.
  `;

   // Create sendEmail params
  const params = {
    Destination: {
      ToAddresses: [event.email]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Hi! I'm Charles sending you an email!"
      }
    },
    Source: "Charles from TreatAnyone <itops@hopeprogram.biz>"
  };

  // Create the promise and SES service object
  const sendPromise = new aws.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)

  try {
    await sendPromise.promise()
    return { statusCode: 200, body: 'Message sent' };
  } catch(err) {
    return { statusCode: 500, body: JSON.stringify(err) };
  }
}
