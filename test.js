


const instagram_download = require ('@juliendu11/instagram-downloader');
 
(async () => {
const value = await instagram_download.downloadMedia('https://scontent-gmp1-1.cdninstagram.com/v/t72.12950-16/10000000_3306216316107303_2039265966442200660_n.mp4?_nc_ht=scontent-gmp1-1.cdninstagram.com&_nc_cat=103&_nc_ohc=g4cNlAqWUoQAX9ne2tl&oh=77a416c1ad5934c1481f1b4ec68f8096&oe=5F37F796', './')
console.log(value)
})();