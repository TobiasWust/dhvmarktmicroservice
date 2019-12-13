const db = require('../modules/db');
const axios = require('axios');

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

  // async sendMail(mail) {
  //   axios.post('http://localhost:9000', mail) // running my mailer on localhost 9000
  //     .then((res) => { console.log(res) }) // errorhandling like a pro
  //     .catch((error) => { console.log('error', error) });
  // },

  mailTemplate(hit) {
    return `Hallo,
    ich habe ${hit.agent.search} für dich gefunden: ${hit.offer.title}, ${hit.offer.price}, ${hit.offer.link}`;
  },

  async sendMail(hit) {
    const { email } = hit.agent;
    const mail = {
      from: 'bla',
      html: this.mailTemplate(hit),
      to: email,
    }
    console.log(this.mailTemplate(hit));
  },

  async checkNmail(offers = []) {
    const hits = await this.check(offers) || [];
    hits.forEach(hit => this.sendMail(hit));
  }
}
