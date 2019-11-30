const mongoose = require('mongoose');
const murl = require('./murl');

mongoose.connect(murl, {
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

const Offer = mongoose.model('Offer', offerSchema);

const db = {
  save(offer) {
    console.log('saving offer', offer.title);
    (new Offer(offer)).save(err => {if (err) console.error(err)});
  },

  async count() {
    return await Offer.countDocuments()
  },

  async getAll() {
    return await Offer.find();
  }
}

module.exports = db;
