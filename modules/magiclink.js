const jwt = require('jsonwebtoken');
const config = require('../config');
const mailer = require('./mailer');

const magiclink = {
  generate(email) { // login tokens are valid for 1 hour
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return jwt.sign({ email, expiration: date }, config.secret)
  },

  mailTemplate(email, token) {
    return `Hallo,
    jemand will deine Emailadresse ${email} für eine Internseitebenutzen. Hier ist ein Token dafür. <a href="https://${config.host}?token=${token}`;
  },

  async login(req, res) { // and send mail
    console.log('logging in')
    const { email } = req.body;
    if (!email) return res.send({ error: 'email required' });
    const token = magiclink.generate(email);
    const mail = {
      from: 'bla',
      html: magiclink.mailTemplate(email, token),
      to: email,
    }
    const r = await mailer.sendMail(mail);
    console.log(r); // todo check for success
    return res.send({ success: 'mail sent' });
  },

  isAuth(req, res, next) {
    let decoded;

    const auth = req.query.token || req.headers.authorization;
    if (!auth) {
      res.send({ error: 'cannot verify jwt' });
      return;
    }

    const token = auth;
    try {
      decoded = jwt.verify(token, config.secret)
    } catch {
      res.send({ error: 'invalid secret' });
    }

    if (!decoded.hasOwnProperty('email') || !decoded.hasOwnProperty('expiration')) {
      res.send({ error: 'invalid jwt' });
      return;
    }

    const { email, expiration } = decoded;
    if (expiration < new Date()) {
      res.send({ error: 'token expired' })
      return;
    }
    res.locals.mail = email;
    return next();
  }
}

module.exports = magiclink;
