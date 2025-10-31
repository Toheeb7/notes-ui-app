// api/notes.js

let notes = [];

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const indexParam = url.searchParams.get('index');
  const index = indexParam ? parseInt(indexParam) : null;

  if (req.method === 'GET') {
    res.status(200).json(notes);
  }

  else if (req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const note = JSON.parse(body || '{}');
    if (!note.title || !note.content) {
      return res.status(400).json({ error: 'Title and content required' });
    }
    notes.push(note);
    res.status(201).json({ message: 'Note added' });
  }

  else if (req.method === 'DELETE') {
    if (index === null || index < 0 || index >= notes.length) {
      return res.status(400).json({ error: 'Invalid index' });
    }
    notes.splice(index, 1);
    res.status(200).json({ message: 'Note deleted' });
  }

  else if (req.method === 'PUT') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const updatedNote = JSON.parse(body || '{}');

    if (index === null || index < 0 || index >= notes.length) {
      return res.status(400).json({ error: 'Invalid index' });
    }
    notes[index] = updatedNote;
    res.status(200).json({ message: 'Note updated' });
  }

  else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
