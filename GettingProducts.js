const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeWebsite() {
  console.log("Starting . . .");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://mikrotik.com/products');

  const productsData = await page.$$eval('#productlist .product', products => {
    return products.map(product => {
      // Get the product name and remove extra spaces and "NEW" keyword
      const name = product.querySelector('.product-description h2 a')?.textContent.trim().replace(/\s+/g, ' ').replace('NEW', '');

      // Get the product description and remove extra spaces
      const description = product.querySelector('.product-description p')?.textContent.trim().replace(/\s+/g, ' ');

      // Get the product price and remove extra spaces
      const price = product.querySelector('.product-info .price')?.textContent.trim().replace(/\s+/g, ' ');

      // Return an object with the product name, description, and price properties
      return { name, description, price };
    }).filter(product => product.name && product.description && product.price);
  });

  console.log(`Found ${productsData.length} products.`);

  // Save products data to a file
  fs.writeFile('K:/Node/WebScraping/Products.txt', JSON.stringify(productsData), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  await browser.close();
}

scrapeWebsite();
