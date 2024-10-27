const Note = require("../model/Note");

exports.createNote = async (req, res) => {
  const { title, content, tags, fileUrl } = req.body;
  const userId = req.user._id;

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      fileUrl,
      userId: userId,
    });

    await note.save();
    res.status(201).json({ message: "Note added successfully", note: note });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.editNote = async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, fileUrl, isPinned } = req.body;

  if (!title && !content && !tags && !fileUrl) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;
    if (fileUrl) note.fileUrl = fileUrl;

    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

exports.getAllNotes = async (req, res) => {
  const userId = req.user._id;

  try {
    const notes = await Note.find({ userId: userId }).sort({ isPinned: -1 });

    return res.json({
      error: false,
      notes,
      message: "All notes successfully retrieved",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

exports.deleteNote = async (req, res) => {
  const userId = req.user._id;
  const noteId = req.params.noteId;
  try {
    const note = await Note.findOne({ _id: noteId, userId: userId });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }
    await Note.deleteOne({ _id: noteId, userId: userId });

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

exports.updatePinnedNote = async (req, res) => {
  const userId = req.user._id;
  const noteId = req.params.noteId;
  const { isPinned } = req.body;

  try {
    const note = await Note.findOne({ _id: noteId, userId: userId });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

exports.searchNote = async (req, res) => {
  const userId = req.user._id;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }
  try {
    const matchingNotes = await Note.find({
      userId: userId,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: " Internal Server error",
    });
  }
};
