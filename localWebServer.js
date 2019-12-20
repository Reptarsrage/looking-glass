const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('qs');

const createServer = () => {
  const port = 30002; // TODO: choose a better port
  const server = http.createServer((req, res) => {
    // parse URL
    const parsedUrl = url.parse(req.url);
    const params = qs.parse(parsedUrl.query);
    const { uri } = params;

    const stat = fs.statSync(uri);
    const fileSize = stat.size;
    const { range } = req.headers;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(uri, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(uri).pipe(res);
    }
  });

  server.on('listening', () => console.log(`Local web server listening on port ${port}`));
  server.on('close', () => console.log('Local web server closing'));
  server.listen(port);
};

module.exports = createServer;
