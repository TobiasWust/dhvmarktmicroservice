const http = require('https');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const airscout = {
  offers: [],
  getAll() {
    const url = `https://www.airscout365.com/index.php/de/anzeigen/alle_anzeigen`;
    console.log('getting airscout ads')
    this.getPage(url)
    return new Promise((resolve) => {
      this.getAllResolve = resolve;
    });
  },
  getPage(url) {
    http.get(`${url}`, res => {
      res.setEncoding('utf8');
      let body = '';
      res.on('data', data => { body += data });
      res.on('end', () => {
        const { document } = (new JSDOM(body)).window;
        [...document.querySelectorAll('.adsmanager-list tr[class^=" trcategory"')].map(e => {
          const offer = {};
          offer.link = e.querySelector('a').href;
          const germanDate = e.querySelector('.adsListDate em').textContent ? e.querySelector('.adsListDate em').textContent.match(/[\d.]+/g)[0] : '0';
          offer.date = Date.parse(germanDate.split('.').reverse().join('-'));
          offer.title = e.querySelectorAll('a')[1].textContent;
          offer.price = e.querySelector('.fad_price') ? e.querySelector('.fad_price').textContent.match(/\d+/g).join('').slice(0, -2) : 0;
          this.offers.push(offer);
        });
        const next = document.querySelector('[title=Weiter]');
        if (next) this.getPage(next)
        else this.getAllResolve(this.offers);
      });
    });
  }
}

module.exports = airscout;
