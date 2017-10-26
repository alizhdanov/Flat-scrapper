const mongoose = require('mongoose');

const DATABASE = 'mongodb://admin:toor@ds115625.mlab.com:15625/flat'

// Connect to our Database and handle any bad connections
mongoose.connect(DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// READY?! Let's go!
require('./models/Flats');


const Flats = mongoose.model('Flats');
const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const baseUrl = 'https://www.bezrealitky.cz/vypis/nabidka-pronajem/byt/praha?priceTo=10000';
const bot = require('./bot');

let lastScrapp = null;


const scrap = () => {
    let amount = 0
    const date = new Date()
    const time = `${date.getHours()}:${date.getMinutes()}`
    console.log('Starting scraping at - ' + time)
    request(baseUrl, (error, response, html) => {

        if(error) {
            console.log(error)
            return
        }

        const { document } = (new JSDOM(html)).window;

        let records = [...document.querySelectorAll('.record')]
            .map(record => {
                let [rent, utils] = record.querySelector('p.price').textContent.match(/(\d+\.)?\d+/gi).map(d => +d.replace('.', ''));
                rent = rent || 0;
                utils = utils || 0;
                const finalPrice = rent + utils;
                const url = record.querySelector('p.short-url').textContent;
                const id = +url.match(/\d+$/)[0];
                return { finalPrice, rent, utils, id, url }
            })

        records.forEach((flat) => {
            Flats
                .findOne({id: flat.id})
                .then((res) => {
                    if (res === null) {

                        const newFlat = new Flats(flat);
                        return newFlat.save()
                    }
                })
                .then((res) => {
                    if (res) {
                        amount++
                        bot.sendMessageTo(
                            '*final price* = ' + flat.finalPrice + ',\n' +
                            '*rent* = ' + flat.rent + ',\n' +
                            '*utils* = ' + flat.utils + ',\n' +
                            '*url* = ' + flat.url
                        )
                    }
                })
                .catch((err) => {
                    bot.sendMessageTo(
                        'ERROR with flat, \n' +
                        '*final price* = ' + flat.finalPrice + ',\n' +
                        '*rent* = ' + flat.rent + ',\n' +
                        '*utils* = ' + flat.utils + ',\n' +
                        '*url* = ' + flat.url
                    )
                })
        })

        console.log(`Found ${amount} flats`)
    })

    lastScrapp = new Date()

}

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, `Received your message - ${chatId}, no worries, I', alive. Last scrap - ${lastScrapp}`);
});

scrap()

setInterval(() => {
    scrap()
}, 1000 * 60 * 10)
