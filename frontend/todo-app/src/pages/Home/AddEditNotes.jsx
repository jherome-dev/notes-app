import { useState, useEffect, useCallback } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useDropzone } from "react-dropzone";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import { storage } from "../../firebaseConfig";
import Spinner from "../../components/Spinner/Spinner";

const AddEditNotes = ({
  noteData,
  type,
  getAllNotes,
  onClose,
  showToastMessage,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  useEffect(() => {
    if (type === "edit" && noteData) {
      setFile(null);
    }
  }, [noteData, type]);

  const addNewNote = async (fileUrl = "") => {
    try {
      const response = await axiosInstance.post("/note/add-note", {
        title,
        content,
        tags,
        fileUrl,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const editNote = async (fileUrl = "") => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(`/note/edit-note/${noteId}`, {
        title,
        content,
        tags,
        fileUrl,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note updated Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const handleFileValidation = (file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError(
        "Invalid file type. Only JPG, PNG, PDF, DOCX, and XLSX files are allowed."
      );
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds the 5MB limit.");
      return false;
    }
    return true;
  };

  const handleFileUpload = (file) => {
    if (file) {
      if (!handleFileValidation(file)) {
        return;
      }
      setLoading(true);
      const storageRef = ref(storage, `notes/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          setLoading(false);
          console.error("Upload failed", error);
          setError("File upload failed. Please try again.");
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setLoading(false);
            type === "edit" ? editNote(downloadURL) : addNewNote(downloadURL);
          } catch (error) {
            setLoading(false);
            console.error("Failed to get download URL", error);
            setError("Failed to retrieve file URL.");
          }
        }
      );
    } else {
      setLoading(true);
      type === "edit" ? editNote(noteData.fileUrl) : addNewNote();
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter title");
      return;
    }
    if (!content) {
      setError("Please enter content");
      return;
    }
    setError("");
    handleFileUpload(file);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (handleFileValidation(file)) {
      setFile(file);
      setError(null);
    } else {
      setFile(null); // Reset the file state if invalid
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    },
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500"
        onClick={onClose}
        aria-label="Close"
      >
        <MdClose className="text-xl m-2 items-center justify-center text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go To The Gym At 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {/* File Upload Section */}
      <div className="mt-3">
        <label className="mb-2 text-sm font-medium input-label">
          Attach File
        </label>
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100 ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              SVG, PNG, JPG, PDF, DOCX (Max 5MB)
            </p>
          </div>
          <input {...getInputProps()} />
        </div>
        {file && <p className="mt-2 text-sm text-gray-500">{file.name}</p>}
        {type === "edit" && noteData?.fileUrl && (
          <div className="flex items-center mt-2">
            <p className="text-sm input-label">
              Existing File:{"  "}
              <span className="text-blue-500 underline">
                <a
                  className="text"
                  href={noteData.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {(() => {
                    const originalUrl = noteData.fileUrl;
                    const fileNameWithPrefix = decodeURIComponent(
                      originalUrl.split("/").pop()
                    );
                    const cleanedFileName = fileNameWithPrefix.replace(
                      /^notes\//,
                      ""
                    );
                    const fileName = cleanedFileName.split("?")[0];
                    return fileName;
                  })()}
                </a>
              </span>
            </p>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <button
        className="btn btn-primary mt-4 w-full"
        onClick={handleAddNote}
        disabled={loading}
      >
        {loading ? <Spinner /> : type === "edit" ? "Update Note" : "Add Note"}
      </button>
    </div>
  );
};

export default AddEditNotes;
