const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const config = require('./config');

const args = process.argv.slice(2);
const targetKey = args[0];

if (!targetKey) {
    console.error("Error: No variable key provided (e.g., COBRE)");
    process.exit(1);
}

const target = config[targetKey];
if (!target) {
    console.error(`Error: Variable ${targetKey} not found in config`);
    process.exit(1);
}

(async () => {
    let value = null;
    let date = null;

    try {
        if (target.type === 'portalminero') {
            value = await scrapePortalMinero(target.url);
        } else if (target.type === 'investing') {
            value = await scrapeInvesting(target.url);
        } else {
            console.error(`Type ${target.type} not yet implemented`);
            process.exit(1);
        }

        console.log(JSON.stringify({ key: targetKey, value: value, date: new Date().toISOString().split('T')[0] }));
        process.exit(0);
    } catch (err) {
        console.error("Scraping failed:", err.message);
        process.exit(1);
    }
})();

async function scrapePortalMinero(url) {
    // Launch puppeteer even for simple sites to be robust against js-rendering
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36');
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Portal Minero usually displays a table. We need the latest value.
        // Strategy: Get full HTML and parse with Cheerio for easier traversal
        const content = await page.content();
        const $ = cheerio.load(content);

        // This selector is a guess based on common table structures. 
        // We might need to refine this after the first test.
        // Assuming the first numeric value in a prominent table or container is what we want.
        // Often these sites have a specific class for the price.

        // Try to find a cell that looks like a price (numeric)
        // Let's grab all table cells
        let foundPrice = null;

        // Specific heuristic for Portal Minero based on typical layout
        // Look for the metadata/price container
        // If we can't find a specific ID, we'll return the text of the body to debug for the user in the first run

        // TEMPORARY: Just dump the text of the main content to see what we get if we can't find a clear selector
        // But let's try a best guess:
        // Table row 1, col 2 usually.

        const possiblePrice = $('td').eq(1).text().trim().replace(',', '.');
        foundPrice = parseFloat(possiblePrice);

        if (isNaN(foundPrice)) {
            // Fallback: try to find any number with $ or clean format
            throw new Error("Could not identify price in PortalMinero structure. Requires HTML inspection.");
        }

        return foundPrice;
    } finally {
        await browser.close();
    }
}

async function scrapeInvesting(url) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36');

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Click "Accept Cookies" if it pops up? Investing has annoying popups.
        // We will try to read the data directly.

        // Investing.com historical data table usually has id="curr_table"
        // Row 1, Col 2 is usually "Price" (Col 1 is Date)

        const content = await page.content();
        const $ = cheerio.load(content);

        // Try multiple potential selectors for Investing's historical table
        let priceText = $('#curr_table tbody tr').first().find('td').eq(1).text();

        if (!priceText) {
            // New investing design might use divs
            // Try searching for the main large price header
            priceText = $('[data-test="instrument-price-last"]').text();
        }

        if (!priceText) throw new Error("Could not find price table on Investing.com");

        // Clean string (remove commas, handle K/M suffixes if any, though historical usually raw)
        priceText = priceText.replace(/,/g, ''); // remove thousands separator
        return parseFloat(priceText);

    } finally {
        await browser.close();
    }
}
