const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./server/database.js');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
  });
}

function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;

  // CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // --- REST API Endpoints ---
  if (url.startsWith('/api/')) {
    try {
      // AUTH: Google
      if (url === '/api/auth/google' && method === 'POST') {
        const body = await parseBody(req);
        let user = db.findUserByEmail(body.email || "ahmed.ali@gmail.com");
        if (!user) {
          user = db.createUser({
            username: body.username || "أحمد العلي (Google)",
            email: body.email || "ahmed.ali@gmail.com",
            role: "user",
            provider: "google",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
          });
        }
        return sendJSON(res, { success: true, user });
      }

      // AUTH: Email Login / Register
      if (url === '/api/auth/email/login' && method === 'POST') {
        const body = await parseBody(req);
        let user = db.findUserByEmail(body.email);
        if (!user) {
          user = db.createUser({
            username: body.username || body.email.split('@')[0],
            email: body.email,
            role: "user",
            provider: "email",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
          });
        }
        return sendJSON(res, { success: true, user });
      }

      // AUTH: Phone OTP Verify
      if (url === '/api/auth/phone/verify' && method === 'POST') {
        const body = await parseBody(req);
        let user = db.findUserByPhone(body.phone);
        if (!user) {
          user = db.createUser({
            username: `قارئ (${body.phone.slice(-4)})`,
            phone: body.phone,
            role: "user",
            provider: "phone",
            avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80"
          });
        }
        return sendJSON(res, { success: true, user });
      }

      // DATABASE: Get Books
      if (url === '/api/books' && method === 'GET') {
        return sendJSON(res, { success: true, books: db.getBooks() });
      }

      // DATABASE: Add Book
      if (url === '/api/books' && method === 'POST') {
        const body = await parseBody(req);
        const book = db.addBook(body);
        return sendJSON(res, { success: true, book });
      }

      // DATABASE: Get Poems
      if (url === '/api/poems' && method === 'GET') {
        return sendJSON(res, { success: true, poems: db.getPoems() });
      }

      // DATABASE: Add Poem
      if (url === '/api/poems' && method === 'POST') {
        const body = await parseBody(req);
        const poem = db.addPoem(body);
        return sendJSON(res, { success: true, poem });
      }

      // DATABASE: Get Quotes
      if (url === '/api/quotes' && method === 'GET') {
        return sendJSON(res, { success: true, quotes: db.getQuotes() });
      }

      // DATABASE: Add Quote
      if (url === '/api/quotes' && method === 'POST') {
        const body = await parseBody(req);
        const quote = db.addQuote(body);
        return sendJSON(res, { success: true, quote });
      }

      // DATABASE: Delete Quote
      if (url.startsWith('/api/quotes/') && method === 'DELETE') {
        const id = url.split('/api/quotes/')[1];
        db.deleteQuote(id);
        return sendJSON(res, { success: true });
      }

      // DATABASE: Get Comments
      if (url.startsWith('/api/comments/') && method === 'GET') {
        const key = decodeURIComponent(url.split('/api/comments/')[1]);
        return sendJSON(res, { success: true, comments: db.getComments(key) });
      }

      // DATABASE: Add Comment
      if (url === '/api/comments' && method === 'POST') {
        const body = await parseBody(req);
        const comments = db.addComment(body.key, body.commentObj);
        return sendJSON(res, { success: true, comments });
      }

      // DATABASE: Add Review
      if (url === '/api/reviews' && method === 'POST') {
        const body = await parseBody(req);
        const reviews = db.addReview(body.bookId, body.reviewObj);
        return sendJSON(res, { success: true, reviews });
      }

    } catch (err) {
      return sendJSON(res, { error: err.message }, 500);
    }
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`🌸 Medad Zahr server & REST Database API running at http://localhost:${PORT}`);
});
