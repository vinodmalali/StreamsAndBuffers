const http = require('http');

const fs = require('fs');

const port = process.env.PORT || 3000;

const server = http.createServer();

server.on('request', (req, res) => {
    // fs.readFile('./data.txt', (err, data) => {
    //     if(err) console.error(err);
    //     res.end(data.toString());
    // })
    const readStream = fs.createReadStream('./data.txt');

    readStream.on('open', () => {
        res.write('Started Streaming....................................................')
    })

    readStream.on('data', (chunk) => {
        res.write(chunk);
    })

    readStream.on('end', () => {
        res.end('Streaming Ended...!!!');
    })
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});