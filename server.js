const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Serve homepage
  if (req.url === '/') {
    fs.readFile('./public/index.html', (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });

  // Serve CSS
  } else if (req.url === '/style.css') {
    fs.readFile('./public/style.css', (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });

  // Serve JS
  } else if (req.url === '/script.js') {
    fs.readFile('./public/script.js', (err, data) => {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(data);
    });

  // GET all notes
  } else if (req.url === '/notes' && req.method === 'GET') {
    fs.readFile('./data.json', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Server error');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      }
    });

  // POST new note
  } else if (req.url === '/notes' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const newNote = JSON.parse(body);
      const notes = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
      notes.push(newNote);
      fs.writeFileSync('./data.json', JSON.stringify(notes, null, 2));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Note added!' }));
    });

  // DELETE note by index
  } else if (req.url.startsWith('/notes/') && req.method === 'DELETE') {
    const index = parseInt(req.url.split('/')[2]);
    const notes = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

    if (index >= 0 && index < notes.length) {
      notes.splice(index, 1);
      fs.writeFileSync('./data.json', JSON.stringify(notes, null, 2));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Note deleted!' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Note not found' }));
    }

  // PUT (edit) note by index
  } else if (req.url.startsWith('/notes/') && req.method === 'PUT') {
    const index = parseInt(req.url.split('/')[2]);
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const updatedNote = JSON.parse(body);
      const notes = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

      if (index >= 0 && index < notes.length) {
        notes[index] = updatedNote;
        fs.writeFileSync('./data.json', JSON.stringify(notes, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Note updated!' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Note not found' }));
      }
    });

  // 404 Not Found
  } else {
    res.writeHead(404);
    res.end('404 Not Found');
  }
});

server.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
