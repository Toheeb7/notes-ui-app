async function loadNotes() {
  try {
    const res = await fetch('/api/notes');
    const notes = await res.json();

    const container = document.getElementById('notes-container');
    container.innerHTML = '';

    notes.forEach((note, index) => {
      const noteDiv = document.createElement('div');
      noteDiv.classList.add('note');
      noteDiv.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <div class="buttons">
          <button onclick="editNote(${index})">✏️ Edit</button>
          <button onclick="deleteNote(${index})">🗑️ Delete</button>
        </div>
      `;
      container.appendChild(noteDiv);
    });
  } catch (err) {
    console.error('Error loading notes:', err);
  }
}

document.getElementById('addBtn').addEventListener('click', async () => {
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();

  if (!title || !content) {
    alert('Please enter both title and content.');
    return;
  }

  try {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) throw new Error('Failed to add note');

    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    loadNotes();
  } catch (err) {
    console.error(err);
    alert('Error adding note!');
  }
});

async function deleteNote(index) {
  try {
    const res = await fetch(`/api/notes?index=${index}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    loadNotes();
  } catch (err) {
    console.error(err);
    alert('Error deleting note!');
  }
}

async function editNote(index) {
  const title = prompt('Enter new title:');
  const content = prompt('Enter new content:');
  if (!title || !content) return;

  try {
    const res = await fetch(`/api/notes?index=${index}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) throw new Error('Failed to update');
    loadNotes();
  } catch (err) {
    console.error(err);
    alert('Error editing note!');
  }
}

loadNotes();
