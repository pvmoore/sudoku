const http = require("http");
const url = require("url");
const qs  = require("querystring");
const fs = require("fs");
const util = require("util");

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  const u   = url.parse(req.url, true);
  let path  = u.pathname == "/" ? "/index.html" : u.pathname;
  const ext = path.substring(Math.max(path.indexOf('.'),0));

  path = "." + path;

  console.log("Request: "+req.url+" (path: "+path+" ext: "+ext+")");

  fs.readFile(path, (err,data) => {
    if(err) {
      console.log("404 - "+path);
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
    res.statusCode = 200;

    let contentType;
    switch(ext) {
      case ".js":
      case ".mjs":
        contentType = "text/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".html":
        contentType = "text/html";
        break;
      default:
        contentType = "text/plain";
        break;
    }
    res.setHeader('Content-Type', contentType);
    res.write(data);
    res.end();
    console.log("Response: "+u.pathname+" ("+data.length+" bytes, "+contentType+")");
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

