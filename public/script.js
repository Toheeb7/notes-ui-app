// Load all notes when page loads
document.addEventListener("DOMContentLoaded", loadNotes);

// Add note
document.getElementById("addNote").addEventListener("click", async () => {
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("Please fill in both fields!");
    return;
  }

  const newNote = { title, content };

  try {
    const response = await fetch("/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });

    if (!response.ok) throw new Error("Failed to add note");

    titleInput.value = "";
    contentInput.value = "";
    loadNotes();
  } catch (err) {
    console.error(err);
    alert("Error adding note!");
  }
});

// Fetch and display all notes
async function loadNotes() {
  try {
    const res = await fetch("/notes");
    if (!res.ok) throw new Error("Failed to load notes");
    const notes = await res.json();

    const container = document.getElementById("notesContainer");
    container.innerHTML = "";

    if (notes.length === 0) {
      container.innerHTML = "<p class='empty'>No notes yet. Add one!</p>";
      return;
    }

    notes.forEach((note, index) => {
      const card = document.createElement("div");
      card.classList.add("note-card");

      card.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <div class="actions">
          <button class="edit-btn" onclick="editNote(${index})">Edit</button>
          <button class="delete-btn" onclick="deleteNote(${index})">Delete</button>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

// Delete note
async function deleteNote(index) {
  try {
    const res = await fetch(`/notes/${index}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");
    loadNotes();
  } catch (err) {
    console.error(err);
    alert("Error deleting note!");
  }
}

// Edit note
async function editNote(index) {
  const title = prompt("Enter new title:");
  const content = prompt("Enter new content:");
  if (!title || !content) return;

  const updatedNote = { title, content };

  try {
    const res = await fetch(`/notes/${index}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNote),
    });
    if (!res.ok) throw new Error("Failed to update");
    loadNotes();
  } catch (err) {
    console.error(err);
    alert("Error editing note!");
  }
}
