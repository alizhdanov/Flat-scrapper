const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
// TODO: wrap it up to Promise probably or await shit
const scrap = (url) => {
    return new Promise((resolve, reject) => {
        request(url, (error, response, html) => {

            if(error) {
                console.log(error)
                reject(error)
                return
            }

            const { document } = (new JSDOM(html)).window;

            let records = [...document.querySelectorAll('.record')].map(record => {
                let [rent, utils] = record.querySelector('p.price').textContent.match(/(\d+\.)?\d+/gi).map(d => +d.replace('.', ''));
                rent = rent || 0;
                utils = utils || 0;
                const finalPrice = rent + utils;
                const url = record.querySelector('p.short-url').textContent;
                const id = +url.match(/\d+$/)[0];
                return { finalPrice, rent, utils, id, url }
            })

            resolve(records)
        })
    })
}

module.exports = scrap