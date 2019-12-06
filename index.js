const aws = require('aws-sdk');
aws.config.update({region: 'us-west-2'});

exports.sendEmail = async function(event, context) {
  console.log("Handling email to", event);

  const data = JSON.parse(event.body);

  const subject = data.subject;
  const recipients = data.recipients.split(",");
  const cc = data.cc.split(",");
  const name = data.name.substr(0, 40).replace(/[^\w\s]/g, '');

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <p>Hi ${name}!</p>
        <p>I'm sending you an email just to test this function. And also proof of modification via CodePipeline test.</p>
      </body>
    </html>
  `;

  const textBody = `
    Hi ${name}!

    I'm sending you an email just to test this function. And also proof of modification via CodePipeline test.
  `;

   // Create sendEmail params
  const params = {
    Destination: {
      ToAddresses: recipients,
      CcAddresses: cc
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
        Data: subject
      }
    },
    Source: "Charles from TreatAnyone <itops@hopeprogram.biz>"
  };

  // Create the promise and SES service object
  const sendPromise = new aws.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)

  try {
    await sendPromise.promise()
    return { statusCode: 200 };
  } catch(err) {
    return { statusCode: 500, body: JSON.stringify(err) };
  }
}
