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
// const bot = require('./bot');

// const scrapper = require('./modules/puppeteer')
const scrapper = require('./modules/scrapper')

let lastScrapp = null;


const scrap = () => {
    let amount = 0
    const date = new Date()
    const time = `${date.getHours()}:${date.getMinutes()}`
    console.log('Starting scraping at - ' + time)

    let records = scrapper(baseUrl)

    console.log('RECORDS---', records)


    // records.forEach((flat) => {
    //     Flats
    //         .findOne({id: flat.id})
    //         .then((res) => {
    //             if (res === null) {
    //
    //                 const newFlat = new Flats(flat);
    //                 return newFlat.save()
    //             }
    //         })
    //         .then((res) => {
    //             if (res) {
    //                 amount++
    //                 bot.sendMessageTo(
    //                     '*final price* = ' + flat.finalPrice + ',\n' +
    //                     '*rent* = ' + flat.rent + ',\n' +
    //                     '*utils* = ' + flat.utils + ',\n' +
    //                     '*url* = ' + flat.url
    //                 )
    //             }
    //         })
    //         .catch((err) => {
    //             bot.sendMessageTo(
    //                 'ERROR with flat, \n' +
    //                 '*final price* = ' + flat.finalPrice + ',\n' +
    //                 '*rent* = ' + flat.rent + ',\n' +
    //                 '*utils* = ' + flat.utils + ',\n' +
    //                 '*url* = ' + flat.url
    //             )
    //         })
    // })

    console.log(`Found ${amount} flats`)

    lastScrapp = new Date()

}

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//
//   const hours = lastScrapp.getHours();
//   const minutes = lastScrapp.getMinutes();
//
//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, `Received your message - ${chatId} \n, no worries, I'm, alive.\n Last scrap - ${hours}:${minutes}`);
// });

scrap()

setInterval(() => {
    scrap()
}, 1000 * 60 * 10)
