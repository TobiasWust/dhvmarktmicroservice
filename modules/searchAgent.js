const db = require('../modules/db');

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

  async checkNmail(offers = []) {
    const hits = this.check(offers) || [];
    hits.forEach(hit => console.log(`hey, ${hit.agent.email}, wir haben einen ${hit.agent.search} Treffer!`, hit))
  }
}
