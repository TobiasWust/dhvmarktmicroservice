const config = require('../config');
const sgMail = require('@sendgrid/mail');


module.exports = mailer = {
  async sendMail({ to, subject, text, html, from = 'dev@wust.dev' }) {
    sgMail.setApiKey(config.sendgrid);
    const msg = {
      to,
      from,
      subject,
      text,
      html
    };
    const status = await sgMail.send(msg);
    return status;
  }
}
