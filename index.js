const dhv = require('./modules/dhv');
const airscout = require('./modules/airscout');
const magiclink = require('./modules/magiclink');
const searchAgent = require('./modules/searchAgent');
const db = require('./modules/db');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const dhvAnalyse = {
  async init(qty = 20) {
    if (1 == 0) {
      const offers = [...await dhv.getAll(), ...airscout.getAll()];
      offers.forEach(offer => db.saveOffer(offer));
    } else {
      // add new to DB
      const dhvOffers = await dhv.getAll(qty);
      const airscoutOffers = await airscout.getAll(qty);
      const allOffers = [...dhvOffers, ...airscoutOffers];
      const dbOffers = await db.getAllOffers();

      const offers = allOffers.filter(e => !dbOffers.map(m => m.link).includes(e.link));
      console.log('new offers:', offers)
      if (offers.length > 0) {
        searchAgent.checkNmail(offers);
        offers.forEach(offer => db.saveOffer(offer));
      }
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
  res.send('updating');
});

// routes go into the server stuff later
app.post('/login', magiclink.login);

app.get('/searchAgent', async (req, res) => {
  res.send(await db.getSearchAgentsByMail(req.query.mail));
}); // todo improve isAuth to do something \o/
// app.get('/searchAgent', magiclink.isAuth, (req, res) => {
//   res.send('der Login für den Suchagenten hat funktioniert :)');
// });

app.post('/searchAgent/add', searchAgent.add);

const server = app.listen(process.env.PORT || 8081, () => {
  const host = server.address().address
  const port = server.address().port
  console.log('glidersearchapi listening at http://%s:%s', host, port)
});
