const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.send = async (options) => {
  const mailOptions = {
    from: `Koa Kekuna <kekoaponolani@gmail.com>`,
    to: options.user.email,
    subject: options.subject,
    html: 'This will be filled out later',
    text: 'This will also be filled out later'
  };

  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};