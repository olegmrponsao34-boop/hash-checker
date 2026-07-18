const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 3464;

function computeHashes(buffer) {
  return {
    md5: crypto.createHash('md5').update(buffer).digest('hex'),
    sha1: crypto.createHash('sha1').update(buffer).digest('hex'),
    sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
    sha512: crypto.createHash('sha512').update(buffer).digest('hex'),
  };
}

function parseMultipart(body, boundary) {
  const parts = [];
  const rawParts = body.split(`--${boundary}`);
  for (const raw of rawParts) {
    if (raw.trim() === '' || raw.trim() === '--') continue;
    const headerEnd = raw.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;
    const headers = raw.slice(0, headerEnd);
    const content = raw.slice(headerEnd + 4);
    const nameMatch = headers.match(/name="([^"]+)"/);
    const filenameMatch = headers.match(/filename="([^"]+)"/);
    if (nameMatch) {
      parts.push({
        name: nameMatch[1],
        filename: filenameMatch ? filenameMatch[1] : null,
        content: content.replace(/\r\n$/, ''),
      });
    }
  }
  return parts;
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  if (req.method === 'GET') {
    const filePath = path.join(__dirname, req.url);
    const ext = path.extname(filePath);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(data);
      return;
    }
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  if (req.method === 'POST' && req.url === '/api/hash') {
    const contentType = req.headers['content-type'] || '';

    if (contentType.includes('application/json')) {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { fileName, fileData } = JSON.parse(body);
          if (fileData === undefined || fileData === null) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'fileData is required' }));
            return;
          }
          const buffer = Buffer.from(fileData, 'base64');
          const hashes = computeHashes(buffer);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            ...hashes,
            fileName: fileName || 'unknown',
            fileSize: buffer.length,
          }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }

    if (contentType.includes('multipart/form-data')) {
      const boundaryMatch = contentType.match(/boundary=(.+)/);
      if (!boundaryMatch) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'No boundary' }));
        return;
      }
      const boundary = boundaryMatch[1];
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString('latin1');
      });
      req.on('end', () => {
        const parts = parseMultipart(body, boundary);
        const filePart = parts.find(p => p.filename);
        if (!filePart) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'No file uploaded' }));
          return;
        }
        const buffer = Buffer.from(filePart.content, 'latin1');
        const hashes = computeHashes(buffer);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          ...hashes,
          fileName: filePart.filename,
          fileSize: buffer.length,
        }));
      });
      return;
    }

    res.writeHead(415, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Unsupported Content-Type' }));
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Hash-Checker сервер запущен на http://localhost:${PORT}`);
});
