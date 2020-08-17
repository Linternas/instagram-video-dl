const getusermedia = require('getusermedia')
const screenRecord = require('screen-record')

getusermedia({ video: true, audio: true }, (err, webcamStream) => {
  screenRecord(window, (err, sourceId, constraints) => {
    getusermedia(constraints, (err, screenStream) => {
      // We now have 2 streams: webcamStream, screenStream
    })
  })
})