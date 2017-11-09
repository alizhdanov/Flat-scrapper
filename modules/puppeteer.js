const puppeteer = require('puppeteer');

const scrap = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url)

    const result = await page.evaluate(() => {
        const records = [...document.querySelectorAll('.record')]
            return records.map(record => {
                const [rent, utils] = record.querySelector('p.price').textContent.match(/(\d+\.)?\d+/gi).map(d => +d.replace('.', ''));
                const finalPrice = rent + utils;
                const url = record.querySelector('p.short-url').textContent;
                const id = +url.match(/\d+$/)[0];
                return { finalPrice, rent, utils, id, url }
            })
    });

    browser.close()
    return result
};

module.exports = scrap