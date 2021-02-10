const pageScraper = require('../routes/scraper.js');
const fs = require('fs').promises;
const xlsx = require('json-as-xlsx');
const api = require('../routes/api.js');
const convert = require('../utils/convertTime.js');

const scrapeAll = async (browserInstance) => {
    let browser;

    try {
        let timeAtStart = Date.now();
        let fileName = 'asialand-scrapping';

        browser = await browserInstance;
        
        await api.connect(browser, 'https://www.asialand.fr/connexion?back=my-account');

        console.log("Scraping https://www.asialand.fr/93-composants...");
        const composants = await pageScraper.scraper(browser, 'https://www.asialand.fr/93-composants', true);
        await fs.writeFile('./assets/composants.json', JSON.stringify(composants), 'utf-8', (err) => { if (err) return console.log(err); });
        
        console.log("Scraping https://www.asialand.fr/94-systeme...");
        const system = await pageScraper.scraper(browser, 'https://www.asialand.fr/94-systeme', true);
        await fs.writeFile('./assets/system.json', JSON.stringify(system), 'utf-8', (err) => { if (err) return console.log(err); });
        
        console.log("Scraping https://www.asialand.fr/95-image-son...");
        const image_son = await pageScraper.scraper(browser, 'https://www.asialand.fr/95-image-son', true);
        await fs.writeFile('./assets/image_son.json', JSON.stringify(image_son), 'utf-8', (err) => { if (err) return console.log(err); });
        
        console.log("Scraping https://www.asialand.fr/96-peripheriques...");
        const peripheriques = await pageScraper.scraper(browser, 'https://www.asialand.fr/96-peripheriques', true);
        await fs.writeFile('./assets/peripheriques.json', JSON.stringify(peripheriques), 'utf-8', (err) => { if (err) return console.log(err); });
        
        console.log("Scraping https://www.asialand.fr/97-reseaux...");
        const net = await pageScraper.scraper(browser, 'https://www.asialand.fr/97-reseaux', true);
        await fs.writeFile('./assets/net.json', JSON.stringify(net), 'utf-8', (err) => { if (err) return console.log(err); });
        
        console.log("Scraping https://www.asialand.fr/98-accessoires...");
        const accessoires = await pageScraper.scraper(browser, 'https://www.asialand.fr/98-accessoires', true);
        await fs.writeFile('./assets/accessoires.json', JSON.stringify(accessoires), 'utf-8', (err) => { if (err) return console.log(err); });
        
        console.log("Scraping https://www.asialand.fr/119-logiciels...");
        const software = await pageScraper.scraper(browser, 'https://www.asialand.fr/119-logiciels', false);
        await fs.writeFile('./assets/software.json', JSON.stringify(software), 'utf-8', (err) => { if (err) return console.log(err); });

        let timeAtEnd = Date.now();

        const time = convert(timeAtEnd - timeAtStart);
  
        console.log(`Scrapping finished in ${time}`);
        
        const json_composants = require('../assets/composants.json');
        const json_software = require('../assets/software.json');
        const json_image_son = require('../assets/image_son.json');
        const json_peripheriques = require('../assets/peripheriques.json');
        const json_net = require('../assets/net.json');
        const json_accessoires = require('../assets/accessoires.json');
        const json_system = require('../assets/system.json');

        const columns = [
            { label: 'Titre', value: 'title' },
            { label: 'Marque', value: 'marque' },
            { label: 'EAN', value: 'ean' },
            { label: 'SKU', value: 'sku' },
            { label: 'Image', value: 'image' },
            { label: 'Description', value: 'description' },
            { label: 'Stock', value: 'stock' },
            { label: 'HT Price', value: 'price' }
        ];

        const content = [ 
            ...json_composants,
            ...json_software,
            ...json_image_son,
            ...json_peripheriques,
            ...json_net,
            ...json_accessoires,
            ...json_system
        ];

        const settings = {
            sheetName: 'Sheet',
            fileName: fileName,
            extraLength: 3,
            writeOptions: {}
        }

        const download = true;

        xlsx(columns, content, settings, download);
        
        console.log(`[Asialand] - Data has been converted to .xlsx at './${fileName}.xlsx'`);

        browser.close();

    } catch (e) {
        console.log(e);
    }

    return browser;
}

module.exports = (browserInstance) => scrapeAll(browserInstance)