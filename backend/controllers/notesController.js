// controllers/notesController.js
import dotenv from "dotenv";
import noteModel from "../models/noteModel.js";

dotenv.config();

/* --------------------------------- Helpers -------------------------------- */

// Escape regex metacharacters in user input
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Build a regex that ignores case and any amount of whitespace between chars.
// "Shopping List" == "shoppinglist" == "Sh Op Pi Ng   LiSt"
const makeSpaceInsensitiveRegex = (raw) => {
  const compact = String(raw).replace(/\s+/g, "");
  const pattern = compact.split("").map((ch) => `${esc(ch)}\\s*`).join("");
  return new RegExp(`^\\s*${pattern}$`, "i");
};

/* ------------------------------ CRUD Handlers ------------------------------ */

// GET /api/notes  -> list all notes (newest first)
export const getAllNotes = async (_req, res) => {
  try {
    const notes = await noteModel.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/notes -> create note
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newNote = new noteModel({ title, content });
    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/notes/:title -> fetch by title (case/space-insensitive)
export const getNoteByTitle = async (req, res) => {
  try {
    const regex = makeSpaceInsensitiveRegex(req.params.title);
    const note = await noteModel.findOne({ title: { $regex: regex } });

    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// PUT /api/notes/:title -> update by title (case/space-insensitive)
export const updateNote = async (req, res) => {
  try {
    const regex = makeSpaceInsensitiveRegex(req.params.title);
    const { newTitle, newContent } = req.body;

    const update = {};
    if (typeof newTitle === "string") update.title = newTitle;
    if (typeof newContent === "string") update.content = newContent;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const note = await noteModel.findOneAndUpdate(
      { title: { $regex: regex } },
      update,
      { new: true, runValidators: true }
    );

    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// DELETE /api/notes/:title -> delete by title (case/space-insensitive)
export const deleteNote = async (req, res) => {
  try {
    const regex = makeSpaceInsensitiveRegex(req.params.title);
    const note = await noteModel.findOneAndDelete({ title: { $regex: regex } });

    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};