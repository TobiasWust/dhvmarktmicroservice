const nodemailer = require("nodemailer");
const conifg = require('../config');

module.exports = mailer = {
  async sendMail({ to, subject, text, html }) {
    let transporter = nodemailer.createTransport({
      host: conifg.mailhost,
      port: 587,
      secure: false,
      auth: {
        user: conifg.mailuser,
        pass: conifg.mailpass
      }
    });

    return await transporter.sendMail({
      from: '"Tobias Wust" <test@wust.dev>', // sender address
      to,
      subject,
      text,
      html
    });
  }
}
