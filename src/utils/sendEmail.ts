import * as nodemailer from 'nodemailer';
import 'dotenv/config'
// async..await is not allowed in global scope, must use a wrapper
export const sendResetEmail = async (email, token) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_AUTH_USER, // generated ethereal user
      pass: process.env.NODEMAILER_AUTH_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"No Replay" Zeeshan.chaudhary.dev@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Verification Mail ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: `<b>Welcome</b>
    <p>${token}</P>
    `, // html body
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
