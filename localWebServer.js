const http = require('http')
const url = require('url')
const fs = require('fs')
const qs = require('qs')
const mime = require('mime-types')
const log = require('electron-log')
const getPort = require('get-port')

const createServer = async () => {
  const defaultChunkSize = 65536 // lower works better here
  const port = await getPort()
  const server = http.createServer((req, res) => {
    try {
      // parse URL
      const parsedUrl = url.parse(req.url)
      const params = qs.parse(parsedUrl.query)
      const { uri: filePath } = params

      // check path and uri (filepath)
      if ((parsedUrl.pathname !== '/video' && parsedUrl.pathname !== '/image') || !fs.existsSync(filePath)) {
        res.writeHead(404)
        res.end()
        return
      }

      // check file
      const stat = fs.statSync(filePath)
      const fileSize = stat.size
      const { range } = req.headers
      const contentType = mime.lookup(filePath)

      // stream file back to client
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : Math.min(fileSize - 1, start + defaultChunkSize)
        const chunksize = end - start + 1
        const file = fs.createReadStream(filePath, { start, end })
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType,
        }
        res.writeHead(206, head)
        file.pipe(res)
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': contentType,
        }
        res.writeHead(200, head)
        fs.createReadStream(filePath).pipe(res)
      }
    } catch (err) {
      log.error(err)
      res.writeHead(500)
      res.end()
    }
  })

  // start server
  server.on('listening', () => log.info(`Local web server listening on port ${port}`))
  server.on('close', () => log.info('Local web server closing'))
  server.listen(port)

  return {
    server,
    port,
  }
}

module.exports = createServer
