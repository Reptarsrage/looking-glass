const http = require("http");
const fs = require("fs");
const mime = require("mime-types");
const Log = require("./logger");

const getPort = require("./getPort");
const FileSystemService = require("./fileSystemService");

async function getGallery(logger, service, req, res) {
  try {
    const galleryId = req.url.searchParams.get("galleryId") ?? "";
    const offset = parseInt(req.url.searchParams.get("offset") ?? "0", 10);
    const sort = req.url.searchParams.get("sort") ?? "none";
    const filters = req.url.searchParams.getAll("filters") ?? [];
    const body = await service.fetchItems(galleryId, offset, sort, filters);
    res.setHeader("cache-control", "public, max-age=604800");
    res.writeHead(200);
    res.write(JSON.stringify(body, null, 2));
    res.end();
  } catch (error) {
    res.writeHead(500);
    res.write(
      JSON.stringify(
        {
          message: error.message,
          stack: error.stack,
        },
        null,
        2
      )
    );
    res.end();
  }
}

async function getFilters(logger, service, req, res) {
  try {
    const filterSectionId = req.url.searchParams.get("filter") ?? "";
    const body = await service.fetchFilters(filterSectionId);
    res.setHeader("cache-control", "public, max-age=604800");
    res.writeHead(200);
    res.write(JSON.stringify(body, null, 2));
    res.end();
  } catch (error) {
    res.writeHead(500);
    res.write(
      JSON.stringify(
        {
          message: error.message,
          stack: error.stack,
        },
        null,
        2
      )
    );
    res.end();
  }
}

function getFile(logger, req, res) {
  const defaultChunkSize = 65536; // lower works better here
  const filePath = req.url.searchParams.get("uri");

  try {
    // check path and uri (filepath)
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end();
      return;
    }

    // check file
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const { range } = req.headers;
    const contentType = mime.lookup(filePath);

    // stream file back to client
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : Math.min(fileSize - 1, start + defaultChunkSize);
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": contentType,
      };
      res.setHeader("cache-control", "public, max-age=604800");
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": contentType,
      };
      res.setHeader("cache-control", "public, max-age=604800");
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    logger.error(err);
    res.writeHead(500);
    res.end();
  }
}

const createServer = async () => {
  const port = await getPort();
  const service = new FileSystemService(port);

  const server = http.createServer((req, res) => {
    try {
      Log.info(`${req.method} ${req.url}`);

      // Add some CORS headers
      res.setHeader("access-control-allow-methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
      res.setHeader("access-control-allow-origin", "*");
      res.setHeader("vary", "Origin");

      // parse URL
      req.url = new URL(req.url, "http://localhost");
      if (req.method !== "GET") {
        // method not allowed
        res.writeHead(405);
        res.end();
        return;
      }

      // route based on path
      const logger = Log.scope(req.url);
      switch (req.url.pathname) {
        case "/image":
        case "/video":
          return getFile(logger, req, res);
        case "/gallery":
          return getGallery(logger, service, req, res);
        case "/filters":
          return getFilters(logger, service, req, res);
        default: {
          // not found
          res.writeHead(404);
          res.end();
          return;
        }
      }
    } catch (error) {
      Log.error("ERROR", error);
      res.writeHead(500);
      res.write(
        JSON.stringify(
          {
            message: error.message,
            stack: error.stack,
          },
          null,
          2
        )
      );
      res.end();
    }
  });

  // start server
  server.on("listening", () => Log.log(`Local web server listening on port ${port}`));
  server.on("close", () => Log.log("Local web server closing"));
  server.listen(port);

  return {
    server,
    port,
  };
};

module.exports = createServer;
