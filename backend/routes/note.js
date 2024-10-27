const express = require("express");
const {
  createNote,
  editNote,
  getAllNotes,
  deleteNote,
  updatePinnedNote,
  searchNote,
} = require("../controllers/noteControllers");
const { ensureAuthenticated } = require("../middleware/auth");
const router = express.Router();

router.post("/add-note", ensureAuthenticated, createNote);
router.put("/edit-note/:noteId", ensureAuthenticated, editNote);
router.get("/all-notes", ensureAuthenticated, getAllNotes);
router.delete("/delete-note/:noteId", ensureAuthenticated, deleteNote);
router.put(
  "/update-note-pinned/:noteId",
  ensureAuthenticated,
  updatePinnedNote
);
router.get("/search-notes", ensureAuthenticated, searchNote);

module.exports = router;
