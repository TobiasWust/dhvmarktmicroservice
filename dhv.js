const http = require('https');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const url = 'https://www.dhv.de/db3/gebrauchtmarkt/anzeigen?suchbegriff=&rubrik=0&hersteller=&muster=&preismin=&preismax=&anbietertyp=0&land=0&plz=&start=0&itemsperpage=2000000&order=1'

const dhv = {
  getAll() {
    console.log('getting offers')
    return new Promise((resolve) => {
      http.get(url, res => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', data => { body += data });
        res.on('end', () => {
          const { document } = (new JSDOM(body)).window;
          const offers = [...document.querySelectorAll('.gm_offer')].map(e => {
            const offer = {};
            offer.link =  e.querySelector('a').href;
            const germanDate = e.querySelector('.gm_seller').querySelectorAll('li')[3].textContent ? e.querySelector('.gm_seller').querySelectorAll('li')[3].textContent.match(/[\d.]+/g)[0] : '0';
            offer.date = Date.parse(germanDate.split('.').reverse().join('-'));
            offer.title = e.querySelector('h2').textContent;
            offer.price = e.querySelector('.gm_price').textContent.match(/\d+/g) ? e.querySelector('.gm_price').textContent.match(/\d+/g)[0] : 0;
            return offer;
          });
          resolve(offers);
        });
      });
    });
  }
}

module.exports = dhv;
