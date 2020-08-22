const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

let proc = new ffmpeg();

proc.addInput('public/video.mp4')
  .addInput('public/audio.mp4')
  .on('start', function (ffmpegCommand) {
    console.log('start');
    /// log something maybe
  })
  .on('progress', function (progress) {
    // console.log('progress');
    console.log(progress.timemark);
    /// do stuff with progress data if you want
  })
  .on('end', function () {
    console.log('end')
    /// encoding is complete, so callback or move on at this point
  })
  .on('error', function (error) {
    console.log(error)
    /// error handling
  })
  .seekInput('45:00')
  .size('640x480')

  .save('out.mp4')
  .run();