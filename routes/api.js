const config = require('../config/config.json');

const api =  {
    async connect(browser, url) {
        const username = config.Asialand.username;
        const password = config.Asialand.password;

        const loginSelector = 'input[name=email]';
        const passwordSelector = 'input[name=password]';
        
        let page = await browser.newPage();

        try {
            await page.goto(url);

            await page.waitForSelector('.container');
    
            await page.type(loginSelector, username, { delay: 10 });
            await page.type(passwordSelector, password, { delay: 10 });

            await page.keyboard.press('Enter');

            await page.waitForTimeout(2000);

            console.log("[Asialand] - I'm connected to https://www.asialand.fr/ ! Let's get started !");

        } catch (e) {
            console.log(e);
            console.log("[Asialand] - I failed to connect to https://www.asialand.fr/, make sure your credentials are right at '../config/config.json'");
        }
    }
}

module.exports = api ;