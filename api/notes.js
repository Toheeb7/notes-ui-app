import fs from "fs";
import path from "path";

const filePath = path.resolve("data.json");

export default function handler(req, res) {
  // Read notes from JSON file
  const getNotes = () => {
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  };

  // Save notes to JSON file
  const saveNotes = (notes) => {
    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
  };

  if (req.method === "GET") {
    const notes = getNotes();
    res.status(200).json(notes);

  } else if (req.method === "POST") {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text required" });

    const notes = getNotes();
    notes.push(text);
    saveNotes(notes);
    res.status(201).json({ message: "Note added" });

  } else if (req.method === "PUT") {
    const { text } = req.body;
    const index = parseInt(req.query.index);
    if (isNaN(index)) return res.status(400).json({ error: "Invalid index" });

    const notes = getNotes();
    if (index < 0 || index >= notes.length)
      return res.status(404).json({ error: "Note not found" });

    notes[index] = text;
    saveNotes(notes);
    res.status(200).json({ message: "Note updated" });

  } else if (req.method === "DELETE") {
    const index = parseInt(req.query.index);
    if (isNaN(index)) return res.status(400).json({ error: "Invalid index" });

    const notes = getNotes();
    if (index < 0 || index >= notes.length)
      return res.status(404).json({ error: "Note not found" });

    notes.splice(index, 1);
    saveNotes(notes);
    res.status(200).json({ message: "Note deleted" });

  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
