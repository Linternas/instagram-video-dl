const axios = require('axios');

const config = {
  headers: {
    cookie: 'XW1B9AALAAGQVeq7Bws23Uqd1eWC;fbm_124024574287414=base_domain=.instagram.com;ig_did=EA8C66E6-C5FB-4F09-AA97-D93D9D46B199;csrftoken=hGyCnFZgyK6prUzGPWXd1jljfKcmn7oq;sessionid=1390665493%3At16kc2unXFNoxx%3A10;ds_user_id=1390665493;shbid=8664;rur=FTW;shbts=1597321435.0675926;fbsr_124024574287414=7Ltp89-U5FuW1aXBZKsWb85xZszx03otrq99wX_xggE.eyJ1c2VyX2lkIjoiMTAwMDA3OTA2NTAyODA5IiwiY29kZSI6IkFRQ1RneWU3bnotV3dkeHBDcjJrNlVKWC1kdG9KQmY0RVpka1FlMkN1RzBfcDhBZ2g0MjBPYmhTWlBhRE5yblB5bGNEbWN0bEo3LVVaRmJ2TFlKRFVDbEdiM3BSNGZNT3M2RllWenpOOXRvNENJWWY1RTNJRkNtOXFORXdJbVdrOXA5djZGelotS2tHQ25YR0lIeHVuUTF5VW9sV1NNMzB6d0dQTlh6OU5PT1F4TndxWlBUUHA0WmNDcG9ZV0N6X0JvRHptZTdrUXFCb0NGWmJRXzZVZUM0SmZuTzBIdTIxSlZOXzhBeWh3ZXBoRi05bFl0dktlR1BpRDhXamZERnc4Ny1kcnIyTHJ2ZjBnUWNLMlFOVFJRSmlwTnNMdjBsM3RkRC1PUFBFRFZpTThkbmgzZ1Jfc3Ztd1R4dEVXMVR6dDNjRXp5cG91X3NBMng0RnBYbUVVa2dWIiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUtUbHB2ZDJQRGtlQVFmc0M1WW4wUXQ1MENLc3BZMW85b2doUkJLZ3Y5aGNaQ0RQSlRHNHR4MXBWdGFGVlVORjVIZFgxSG83ekRvelhCbjVZRGVLTTRDNjkyRlRNYVN2UTRYRVA3N1l4ZVZ6ZmJDWkJKYWpZb2tXa3MyM21WQXkwMENXemRzOURObUx3Tng3WFJxZE1LdWJaQnNHOFBjRlJaQUZCUEZrIiwiYWxnb3JpdGhtIjoiSE1BQy1TSEEyNTYiLCJpc3N1ZWRfYXQiOjE1OTczMjE1NDd9;urlgen="{\"114.205.163.25\": 9318}:1k6D4p:CO2Q04C0VYWk1xP5ywvLsmoYDhk";',
    'User-Agent': 'Instagram 10.26.0 (iPhone7,2; iOS 10_1_1; en_US; en-US; scale=2.00; gamut=normal; 750x1334) AppleWebKit/420+'
  }
}

const userId = '1346628888'

const urlRegex = /<Representation\b[^>]*>(.*?)<\/Representation>/g

let videoUrl = ''
let audioUrl = ''

axios({
  url: `https://i.instagram.com/api/v1/feed/user/${userId}/story/`,
  method: 'GET',
  headers: config.headers
})
  .then(response => {
    const manifest = String(response.data.post_live_item.broadcasts[2].dash_manifest)
    parseVideoUrls(manifest.match(urlRegex))
    downloadVideo()

  })
  .catch(error => console.log(error.response));

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

const downloadVideo = () => {
  (async () => {
    const value = await instagram_download.downloadMedia(videoUrl, './')
    console.log(value)
  })();
}