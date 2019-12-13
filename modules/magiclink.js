const jwt = require('jsonwebtoken');
const axios = require('axios');
const config = require('../config');

const magiclink = {
  async sendMail(mail) {
    axios.post('http://localhost:9000', mail) // running my mailer on localhost 9000
      .then((res) => { console.log(res) }) // errorhandling like a pro
      .catch((error) => { console.log('error', error) });
  },

  generate(email) { // login tokens are valid for 1 hour
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return jwt.sign({ email, expiration: date }, config.secret)
  },

  mailTemplate(email, token) {
    return `Hallo,
    jemand will deine Emailadresse ${email} für eine Internseitebenutzen. Hier ist ein Token dafür. <a href="https://${config.host}?token=${token}`;
  },

  login(req, res) { // and send mail
    console.log('logging in')
    const { email } = req.body;
    if (!email) return res.send({ error: 'email required' });
    const token = magiclink.generate(email);
    const mail = {
      from: 'bla',
      html: magiclink.mailTemplate(email, token),
      to: email,
    }
    magiclink.sendMail(mail);
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

    const findUserByEmail = (email) => {
      if (email === 'kontakt@tobiaswust.de') return 'Wust' // super sophisticated database mock
      else return;
    };

    const user = findUserByEmail(email) // todo: database stuff
    if (!user) {
      res.send({ error: 'user not found' });
      return;
    }
    return next();
  }
}

module.exports = magiclink;
