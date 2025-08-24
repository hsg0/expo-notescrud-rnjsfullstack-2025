import express from "express";
import {
    createNote,
    deleteNote,
    getAllNotes,
    getNoteByTitle,
    updateNote,
} from "../controllers/notesController.js";

const router = express.Router();

// Collection routes
router.get("/", getAllNotes);     // GET /api/notes
router.post("/", createNote);     // POST /api/notes

// Item routes (by title)
router.get("/:title", getNoteByTitle);   // GET /api/notes/:title
router.put("/:title", updateNote);       // PUT /api/notes/:title
router.delete("/:title", deleteNote);    // DELETE /api/notes/:title

export default router;