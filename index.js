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
        <p>Hi ${name} AKA CRISPULO!</p>
        <p>I'm sending you an email just to test this function. And also proof of modification via <a href="https://aws.amazon.com/codepipeline/">CodePipeline</a> test.</p>
        <p>Kindly confirm if the changes appear on the email by sending chat to <b>Clififi</b></p>
      </body>
    </html>
  `;

  const textBody = `
    Hi ${name} AKA CRISPULO!

    I'm sending you an email just to test this function. And also proof of modification via  <a href="https://aws.amazon.com/codepipeline/">CodePipeline</a> test.

    Kindly confirm if the changes appear on the email by sending chat to <b>Clififi</b>
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
