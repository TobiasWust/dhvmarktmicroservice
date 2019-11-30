const dhv = require('./dhv');
const db = require('./db');
const express = require('express');
const cors = require('cors');
const app = express();

const dhvAnalyse = {
  async init() {
    if (await db.count() === 0) {
      const offers = await dhv.getAll();
      offers.forEach(offer => db.save(offer));
    } else {
      // add new to DB
      const dhvOffers = await dhv.getAll();
      const dbOffers = await db.getAll();
      const offers = dhvOffers.filter(e => !dbOffers.map(m => m.link).includes(e.link));
      if (offers.length > 0) offers.forEach(offer => db.save(offer));
      else console.log('no new Offers')
    }
  },
  async getOffers() {
    const dbOffers = await db.getAll();
    return dbOffers;
  }
}

app.use(cors);

app.get('/', async (_req, res) => {
  const offers = (await dhvAnalyse.getOffers()).map(e => {
    r = {};
    r.link = e.link;
    r.title = e.title;
    r.price = e.price;
    r.date =  e.date;
    return r;
  })
  res.json(offers);
});

app.post('/update', async (_req, res) => {
  dhvAnalyse.init();
});

const server = app.listen(process.env.PORT || 8081, () => {
  const host = server.address().address
  const port = server.address().port
  console.log('immoapi listening at http://%s:%s', host, port)
})
