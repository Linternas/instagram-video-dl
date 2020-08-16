const axios = require('axios');

const config = {
  headers: {
    cookie: 'ig_did=0987A9FA-9ECB-4DDE-AD88-240D1200E769; mid=XzVe0QALAAHr3gVqoHvxismOKBl4; fbm_124024574287414=base_domain=.instagram.com; shbid=8664; shbts=1597333206.792559; rur=FTW; fbsr_124024574287414=IP7knr5BgPSb7_UFRjfR225Flleteve7VgSL7FSlZXQ.eyJ1c2VyX2lkIjoiMTAwMDA3OTA2NTAyODA5IiwiY29kZSI6IkFRQzBxay04cUZwT1QzckZGaW9yT1FzMXNxdHlBYTd4Y29pbll3eDRTMjUwLUFDSTNCQVhZLWxNZjEwSWx3VXFVNlZOQlk2X1A2cTJ5MWR6c3QzMWV0djY2c2NsZUV2TlEtZXRmalphVmVfRWptSDhOZUJnWUxRdUNNNUhiUGlBVVhWUmZFVFZpVzI0b3RLMVo3cTc3bWJUZWQxVzlxT19TaHVBYjJqTXJrd0NfclJrcGxPekRCX19wOHJzWUpGN3VGbDl6Zm5oMjZUbjUwT3MydV9oWlptWWtuajVVam5TbldQMmcxRU8tUGwzM19WVWpqdUVRYmY5UUlaZmJjSVZoS3I5dUNSN2ZGdW4yYU1IQklPVzJSeVc0Wm4ydURZMDV4Rl9BQ2I4ZGZJQUhRR1IzZm1peHJNUHVFRGhRcjVDbER4R2tRNVNXTnN4UWJka21GNTRWRTM3Iiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQU1YVlZ6R2trWkJxWUNUWFB6RnRRU3cxamY2ZUFJdVpCQ3ZRZ2c4RG5PYVJyTkZ3V2VjRTZWSXkzeVpDb3VtbnI4aVpBNFBKWkJwTWxaQWx5WFh6VjVud2N3UFhDQ1BqSWVRR1I0dWJoNWJoNHdGVFExQlR1Nm9mWkFtV01nQ1dBRjJDdzdhQVdhRVFZVG9uY2drOWNNNXpOZXVud20zZjRlejk1bndOSHBYIiwiYWxnb3JpdGhtIjoiSE1BQy1TSEEyNTYiLCJpc3N1ZWRfYXQiOjE1OTczMzMzNjF9; ds_user_id=1390665493; sessionid=1390665493%3AYIaQ6EDwtEyRiu%3A20; csrftoken=yW0XiEjsp9Dhck0gtCoTz6OMwopjfuQo; urlgen="{\"114.205.163.25\": 9318}:1k6Fzf:3uNEUNeEVQlbesOoTgwtGKE7lnA',
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
    // downloadVideo()
    console.log(videoUrl)
    console.log(audioUrl)

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

  console.log(urlInfo)

  // 어떤게 가장 큰지 비교한다 세로 우선
  for (const info of urlInfo) {
    if (info.mimeType === 'audio/mp4') {
      audioUrl = info.url
      continue;
    }

    if (height < info.height) {
      height = info.height
      videoUrl = info.url
    }
  }
}

const downloadVideo = () => {

}