const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const cheerio = require('cheerio'); // DOM 핸들링
const axios = require('axios');

const csv = fs.readFileSync('./data/coupang.csv');
// console.log(csv.toString('utf-8'));
const sendData = parse(csv.toString('utf-8'));
// console.log(sendData);
const crawler = async () => {
  let result,
    title,
    price,
    img,
    wrTxt = '',
    $;
  for (let v of sendData) {
    result = await axios.get(v[1]);
    if (result.status === 200) {
      $ = cheerio.load(result.data);
      title = $('h2.prod-buy-header__title').text();
      price = $('.total-price strong').text().trim();
      price = price.substr(0, price.indexOf('원')) + '원';
      img = $('img.prod-image__detail').attr('src').trim();
      console.log(title, price, img, '\n');
      wrTxt += `${v[0]},${v[1]},${title},${price},${img}\n`;
    }
    // console.log(result);
    fs.writeFileSync('./result/coupang.csv', wrTxt);
  }
};

crawler();
