# sam-sending-email-poc
Simple application to send emails using AWS SAM and AWS SES (Simple Email Service)


## To Test:

1. Use any API testing tools: (ARC, Postman, etc.)
2. Create a POST request to https://5189j2u0d5.execute-api.us-west-2.amazonaws.com/Prod/sendEmail with the following request parameters:
  - recipients (e.g.: 'test@test.com' or 'test@test.com,test2@test.com' for multiple recipients)
  - cc (same format as recipients)
  - subject
  - name
3. Check your email accounts for verification of email.
