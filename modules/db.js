const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.murl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, error => {
  console.log(error ? error : 'connected to db');
});

const offerSchema = new mongoose.Schema({
  link: String,
  date: Number,
  title: String,
  price: Number,
});

const searchAgentSchema = new mongoose.Schema({
  email: String,
  search: String,
  expirationDate: Number,
});

const Offer = mongoose.model('Offer', offerSchema);
const SearchAgent = mongoose.model('SearchAgent', searchAgentSchema);

const db = {
  saveOffer(offer) {
    (new Offer(sanitizeOffer(offer))).save(err => { if (err) console.error(err) });
  },

  sanitizeOffer(offer) {
    r.link = offer.link
    r.date = offer.date
    r.title = offer.title
    r.price = offer.price
    return r;
  },

  async countOffers() {
    return await Offer.countDocuments()
  },

  async getAllOffers() {
    return await Offer.find();
  },

  saveSearchAgent(searchAgentData) {
    // (new SearchAgent(sanitizeSearchAgent(searchAgent))).save(err => { if (err) console.error(err) });
    (new SearchAgent(searchAgentData)).save(err => { if (err) console.error(err) });
  },

  sanitizeSearchAgent(searchAgent) {
    r.email = searchAgent.email
    r.search = searchAgent.search
    r.expirationDate = searchAgent.expirationDate
    return r;
  },

  async getSearchAgentsByMail(email) {
    return await SearchAgent.find({ email });
  },

  async getSearchAgentsBySearch(search) {
    return await SearchAgent.find({ search });
  },

  async getAllSearchAgents() {
    return await SearchAgent.find();
  }
}

module.exports = db;
