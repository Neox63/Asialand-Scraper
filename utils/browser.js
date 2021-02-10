const puppeteer = require('puppeteer');

const start = async () => {
    let browser;

    try {
        console.log("Starting...");

        browser = await puppeteer.launch({
            headless: true,
            args: ["--disable-setuid-sandbox"], 'ignoreHTTPSErrors': true
        });
    } catch (e) {
        console.log(e);
    }

    return browser;
}

module.exports = { start }