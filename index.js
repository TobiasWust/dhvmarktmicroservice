const dhv = require('./dhv');
const airscout = require('./airscout');
const magiclink = require('./magiclink');
const db = require('./db');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const dhvAnalyse = {
  async init(qty) {
    if (await db.count() === 0) {
      const offers = [...await dhv.getAll(), ...airscout.getAll()];
      offers.forEach(offer => db.save(offer));
    } else {
      // add new to DB
      const dhvOffers = await dhv.getAll(qty);
      const airscoutOffers = await airscout.getAll(qty);
      const allOffers = [...dhvOffers, ...airscoutOffers];
      const dbOffers = await db.getAll();

      const offers = allOffers.filter(e => !dbOffers.map(m => m.link).includes(e.link));
      if (offers.length > 0) offers.forEach(offer => db.save(offer));
      else console.log('no new Offers')
    }
  },
  async getOffers() {
    const dbOffers = await db.getAll();
    return dbOffers;
  }
}

app.get('/', async (_req, res) => {
  dhvAnalyse.init(20); // always get the latest
  const offers = (await dhvAnalyse.getOffers()).map(e => {
    r = {};
    r.link = e.link;
    r.title = e.title;
    r.price = e.price;
    r.date = e.date;
    return r;
  })
  res.json(offers);
});

app.get('/update', async (_req, res) => {
  dhvAnalyse.init(100);
});

// routes go into the server stuff later
app.post('/login', magiclink.login);

app.get('/searchAgent', magiclink.isAuth); // todo improve isAuth to do something \o/
app.get('/searchAgent', (req, res) => {
  res.send('der Login für den Suchagenten hat funktioniert :)');
});


const server = app.listen(process.env.PORT || 8081, () => {
  const host = server.address().address
  const port = server.address().port
  console.log('glidersearchapi listening at http://%s:%s', host, port)
});
