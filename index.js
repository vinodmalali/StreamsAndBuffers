const express = require("express");

const app = express();

const fs = require("fs");

const multiparty = require('multiparty');

app.get("/", function (req, res) {

  res.sendFile(__dirname + "/index.html");

});

app.get("/video", function (req, res) {

  // Ensure there is a range given for the video
  const range = req.headers.range;

  // get video stats (about 61MB)
  const videoPath = "bigbuck.mp4";

  const videoSize = fs.statSync("bigbuck.mp4").size;

  console.log(range);

  if (!range) {

    res.writeHead(200, {
      'Content-Type': 'video/mp4'
    });

    fs.createReadStream(videoPath).pipe(res);

  }
  else {

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = (10 ** 6) * 1; // 1MB

    const start = Number(range.replace(/\D/g, ""));

    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;

    const headers = {
      "Content-Type": "video/mp4",
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
  }


});

app.post('/uploadVideo', function (req, res) {

  const form = new multiparty.Form();

  form.on('part', (part) => {

    part.pipe(fs.createWriteStream(`./uploads/${part.filename}`));

    part.on('end', () => {

      res.writeHead(200, {
        'Content-Type': 'text/html'
      })

      res.end(`<hl>successfully uploaded</h1>`);

    });

  });

  form.parse(req);

})

app.get('/upload', function (req, res) {

  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  res.end(`
  <form action="/uploadVideo" method="post" enctype="multipart/form-data">
      <input type="file" name="file">
      <input type="submit" value="Upload">
  </form>
`);

});

app.listen(8000, function () {
  console.log("Listening on port 8000!");
});
