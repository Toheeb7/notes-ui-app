const notesContainer = document.getElementById("notesContainer");
const noteInput = document.getElementById("noteInput");
const addNoteBtn = document.getElementById("addNoteBtn");

// Load all notes from the server
async function loadNotes() {
  try {
    const res = await fetch("/api/notes");
    const notes = await res.json();

    notesContainer.innerHTML = "";

    notes.forEach((note, index) => {
      const noteDiv = document.createElement("div");
      noteDiv.classList.add("note");

      noteDiv.innerHTML = `
        <p>${note}</p>
        <div class="buttons">
          <button class="edit-btn" onclick="editNote(${index})">Edit</button>
          <button class="delete-btn" onclick="deleteNote(${index})">Delete</button>
        </div>
      `;

      notesContainer.appendChild(noteDiv);
    });
  } catch (err) {
    console.error("Error loading notes:", err);
  }
}

// Add a new note
addNoteBtn.addEventListener("click", async () => {
  const newNote = noteInput.value.trim();
  if (!newNote) return alert("Please enter a note!");

  try {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newNote }),
    });

    if (!res.ok) throw new Error("Failed to add note");

    noteInput.value = "";
    loadNotes();
  } catch (err) {
    console.error(err);
    alert("Error adding note!");
  }
});

// Edit a note
async function editNote(index) {
  const newText = prompt("Enter new text for your note:");
  if (!newText) return;

  try {
    const res = await fetch(`/api/notes/${index}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    });

    if (!res.ok) throw new Error("Failed to update note");

    loadNotes();
  } catch (err) {
    console.error(err);
    alert("Error editing note!");
  }
}

// Delete a note
async function deleteNote(index) {
  try {
    const res = await fetch(`/api/notes/${index}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete note");
    loadNotes();
  } catch (err) {
    console.error(err);
    alert("Error deleting note!");
  }
}

// Load notes when the page opens
loadNotes();
