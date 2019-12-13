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
  expirationDate: Number,
  lastCheck: String,
});

const Offer = mongoose.model('Offer', offerSchema);

const db = {
  save(offer) {
    (new Offer(sanitize(offer))).save(err => { if (err) console.error(err) });
  },

  sanitize(offer) {
    r.link = offer.link
    r.date = offer.date
    r.title = offer.title
    r.price = offer.price
    return r;
  },

  async count() {
    return await Offer.countDocuments()
  },

  async getAll() {
    return await Offer.find();
  }
}

module.exports = db;
