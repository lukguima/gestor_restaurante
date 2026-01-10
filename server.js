const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4001;

const server = http.createServer((req, res) => {
  console.log(`Request for: ${req.url}`);
  
  // Remove query string parameters (e.g. ?foo=bar)
  const reqPath = req.url.split('?')[0];
  
  let filePath = reqPath === '/' ? 'index.html' : reqPath.substring(1);
  
  // Prevent directory traversal attacks
  const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
  const absolutePath = path.join(__dirname, safePath);
  
  console.log(`Trying to read: ${absolutePath}`);

  const extname = path.extname(absolutePath);
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }

  fs.readFile(absolutePath, (error, content) => {
    if (error) {
      console.error(`Error reading file: ${error.code}`);
      if(error.code == 'ENOENT'){
        res.writeHead(404);
        res.end(`File not found: ${absolutePath}`);
      } else {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving files from: ${__dirname}`);
});
