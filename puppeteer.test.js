
const urlRegex = /<Representation\b[^>]*>(.*?)<\/Representation>/g
let videoUrl = ''
let audioUrl = ''

const puppeteer = require('puppeteer');


(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation()

  await page.goto('https://www.instagram.com');

  await page.waitForSelector('#loginForm > .Igw0E > .Igw0E > .sqdOP > .KPnG0')
  await page.click('#loginForm > .Igw0E > .Igw0E > .sqdOP > .KPnG0')

  await navigationPromise

  await page.waitForSelector('.login_form_container > #login_form > #loginform #email')
  await page.click('.login_form_container > #login_form > #loginform #email')
  await page.type('.login_form_container > #login_form > #loginform #email', '');

  await page.waitFor(5000)

  await page.waitForSelector('.login_form_container > #login_form > #loginform #pass')
  await page.click('.login_form_container > #login_form > #loginform #pass')
  await page.type('.login_form_container > #login_form > #loginform #pass', '', { delay: 200 });


  await page.waitForSelector('.login_form_container > #login_form > #loginform #loginbutton')
  await page.click('.login_form_container > #login_form > #loginform #loginbutton')

  await navigationPromise

  // page.once('response', (response) => {
  //   console.log(response)
  // })
  await page.waitFor(5000)

  // enable request interception
  await page.setRequestInterception(true);
  // add header for the navigation requests
  page.on('request', request => {
    // Do nothing in case of non-navigation requests.
    if (!request.isNavigationRequest()) {
      request.continue();
      return;
    }
    // Add a new header for navigation request.
    const headers = request.headers();
    headers['User-Agent'] = 'Instagram 10.26.0 (iPhone7,2; iOS 10_1_1; en_US; en-US; scale=2.00; gamut=normal; 750x1334) AppleWebKit/420+';
    request.continue({ headers });
  });

  await page.waitFor(10000)

  // navigate to the website
  await page.goto('https://i.instagram.com/api/v1/feed/user/1346628888/story/');

 
  const response = await page.goto('https://i.instagram.com/api/v1/feed/user/1346628888/story/');
  const data = await (await response.text()).replace('\u003c', '<').replace('\u003e', '>');

  console.log(JSON.parse(data.post_live_item.broadcasts[2].dash_manifest))
  parseVideoUrls(manifest.match(urlRegex))

  console.log(videoUrl)
  console.log(audioUrl)

  // await page.screenshot({path: 'example.png'});

  // await browser.close();
})();



const parseVideoUrls = (urlList) => {
  const urlInfo = []
  let height = 0

  const mimeTypeRegex = /mimeType="]*(.*?)"/
  const widthRegex = /width="]*(.*?)"/
  const heightRegex = /height="]*(.*?)"/
  const urlRegex = /<BaseURL]*(.*?)<\/BaseURL>/

  for (const url of urlList) {
    urlInfo.push({
      mimeType: url.match(mimeTypeRegex)[1],
      // width: Number(url.match(widthRegex)[1]),
      height: (url.match(heightRegex)) !== null ? Number(url.match(heightRegex)[1]) : null,
      url: (url.match(urlRegex)) !== null ? url.match(urlRegex)[1].replace(/amp;/g, '') : null
    })
  }

  // 어떤게 가장 큰지 비교한다 세로 우선
  for (const info of urlInfo) {
    if (info.mimeType === 'audio/mp4') {
      audioUrl = info.url
      continue;
    }

    if (height < info.height) {
      videoUrl = info.url
    }
  }
}


