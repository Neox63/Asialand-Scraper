const scraper = {
    index: 1,
    pageIndex: 1,

    async scraper(browser, url, hasPagination) {
        let page = await browser.newPage();

        await page.goto(url);

        let scrapedData = [];

        const scrapeCurrentPage = async () => {
            await page.waitForSelector('.main-content');
            
            let urls = await page.$$eval('.product-list-wrapper > article', links => {
                links = links.map((el) => el.querySelector('.product-cover-link').href);

                return links;
            });        

            const pagePromise = (link) => new Promise (async (resolve, reject) => {
                let dataObject = {};
                let newPage = await browser.newPage();
                let msAtStart = Date.now();

                await newPage.setDefaultNavigationTimeout(0); 
                await newPage.goto(link);

                try {
                    dataObject['title'] = await newPage.$eval('h1.page-heading', text => text.textContent.substring(text.textContent.indexOf('|') + 1));

                } catch (e) {
                    dataObject['title'] = "Titre non disponible";
                }

                try {
                    dataObject['marque'] = await newPage.$eval('h1.page-heading', text => text.textContent.substring(0, text.textContent.indexOf('|') - 1));

                } catch (e) {
                    dataObject['marque'] = "Marque non disponible";
                }

                try {
                    dataObject['image'] = await newPage.$eval('.zoomWindow', img => {
                        img = img.style.backgroundImage
                        let text = img.substring(img.indexOf('("') + 2, img.indexOf('")'));

                        return text;
                    });

                } catch (e) {
                    dataObject['image'] = "Image non disponible";
                }

                try {
                    dataObject['ean'] = await newPage.$eval('.product-reference:not(.attribute-item)', text => text.textContent.substring(text.textContent.indexOf(':') + 2));

                } catch (e) {
                    dataObject['ean'] = "EAN non disponible";
                }

                try {
                    dataObject['sku'] = await newPage.$eval('.product-reference.attribute-item', text => text.textContent.substring(text.textContent.indexOf(':') + 1));

                } catch (e) {
                    dataObject['sku'] = "SKU non disponible";
                }

                try {
                    dataObject['price'] = await newPage.$eval('.price.product-price', text => text.textContent);

                } catch (e) {
                    dataObject['price'] = "Prix non disponible";
                }

                try {
                    dataObject['stock'] = await newPage.$eval('.sld-stock > strong', text => text.textContent);

                } catch (e) {
                    dataObject['stock'] = "En cours de réapprovisionnement";
                }

                try {
                    dataObject['description'] = await newPage.$eval('.product-description-short', text => text.textContent);

                } catch (e) {
                    dataObject['description'] = "Description non disponible";
                }

                console.log(`[Asialand] - Product ${this.index} has been scrapped successfully [~${Date.now() - msAtStart} ms]`);
                this.index++;

                resolve(dataObject);

                await newPage.close();
            });

            for (link in urls) {
                const currentPageData = await pagePromise(urls[link]);
                scrapedData.push(currentPageData);
            }

            if (hasPagination) {
                let nextButtonExist = true;

                try {
                    const nextButton = await page.$eval('.next', a => a.textContent);
                    nextButtonExist = true;
    
                } catch (e) {
                    nextButtonExist = false; 
                    console.log("[Asialand] - Nothing else to scrap there, going forward !");
                    this.index = 1;
                    this.pageIndex = 2; 
                }
    
                if (nextButtonExist) {
                    await page.click('.next');
                    this.pageIndex++;
                    console.log(`[Asialand] - Navigating to the next page... (${this.pageIndex})`);
    
                    return scrapeCurrentPage();
                }
            }

            await page.close();

            return scrapedData;
        }

        let data = await scrapeCurrentPage();

        return data;
    }
}

module.exports = scraper;