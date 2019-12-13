const db = require('../modules/db');
const mailer = require('./mailer')

module.exports = searchAgent = {
  add(req, res) { // and send mail
    const { email } = req.body;
    if (!email) return res.send({ error: 'email required' });
    console.log(req.body);
    db.saveSearchAgent(req.body);
    return res.send({ success: 'Searchagend for email added' });
  },

  async check(offers = []) {
    let hits = [];
    const agents = await db.getAllSearchAgents();
    agents.forEach(agent => {
      offers.forEach(offer => {
        if (offer.title.includes(agent.search)) hits.push({ offer, agent })
      })
    })
    return hits;
  },

  mailTemplate(hit) {
    return `Hallo,
    ich habe ${hit.agent.search} für dich gefunden: ${hit.offer.title}, ${hit.offer.price}, ${hit.offer.link}`;
  },

  async prepareMail(hit) {
    const { email } = hit.agent;
    const mail = {
      html: this.mailTemplate(hit),
      text: this.mailTemplate(hit),
      subject: 'Suchagenttreffer',
      to: email,
    }
    mailer.sendMail(mail);
  },

  async checkNmail(offers = []) {
    const hits = await this.check(offers) || [];
    hits.forEach(hit => this.prepareMail(hit));
  }
}
