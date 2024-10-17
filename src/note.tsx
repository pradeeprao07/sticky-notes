import React, { useState, useEffect } from "react";
import { CiSaveDown2 } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import randomcolor from "randomcolor";
import "./App.css";

export default function Note() {
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteDescription, setNoteDescription] = useState<string>("");
  const [saveNote, setSaveNote] = useState<any[]>([]);
  const [popUp, setPopUp] = useState<boolean>(false);
  const [accessNoteID, setAccessNoteID] = useState<any>(null);
  const [noteColor, setNoteColor] = useState<any>("");

  useEffect(() => {
    if (saveNote.length > 0) {
      localStorage.setItem("saveNote", JSON.stringify(saveNote));
    }
  }, [saveNote]);

  useEffect(() => {
    const fetchNotesFromStore = localStorage.getItem("saveNote");
    if (fetchNotesFromStore) {
      setSaveNote(JSON.parse(fetchNotesFromStore));
    }
  }, []);

  const displayNoteOnPopUp = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPopUp(true);
    setNoteColor(randomcolor());
  };

  const handleUpdateNote = (noteID: string) => {
    const updateNote = saveNote.find((note: any) => note.id === noteID);
    if (updateNote) {
      setNoteTitle(updateNote.title);
      setNoteDescription(updateNote.description);
      setNoteColor(updateNote.color);
      setAccessNoteID(noteID);
      setPopUp(true);
    }
  };

  const handleSavingNote = () => {
    if (accessNoteID) {
      setSaveNote(
        saveNote.map((note: any) =>
          note.id === accessNoteID
            ? {
                ...note,
                title: noteTitle,
                description: noteDescription,
                color: noteColor,
              }
            : note
        )
      );
    } else {
      const newID = uuidv4();
      setSaveNote((prevNote: any[]) => [
        {
          id: newID,
          title: noteTitle,
          description: noteDescription,
          color: noteColor,
        },
        ...prevNote,
      ]);
    }
    setPopUp(false);
    setNoteTitle("");
    setNoteDescription("");
    setAccessNoteID(null);
  };

  const handleCancelNotePopUp = () => {
    setPopUp(false);
    setNoteTitle("");
    setNoteDescription("");
  };

  const handleDeleteNote = (noteID: string) => {
    setSaveNote(saveNote.filter((note: any) => note.id !== noteID));
    setNoteTitle("");
    setNoteDescription("");
  };

  return (
    <div>
      <div className={popUp ? "blur-background" : ""}>
        <h1 className="heading">Sticky Wall</h1>
        <div className="savedNote">
          {saveNote.map((data: any, index: any) => (
            <div
              key={index}
              className="displayNote"
              style={{ backgroundColor: data.color }}
            >
              <i className="pin"></i>
              <p className="displaySavedTitle">{data.title}</p>
              <p className="displaySavedDescription">{data.description}</p>
              <div className="alignFormattingIcons">
                <EditOutlined
                  className="editIcon"
                  title="Edit"
                  onClick={() => handleUpdateNote(data.id)}
                />
                <DeleteOutlined
                  className="deleteIcon"
                  title="Delete"
                  onClick={() => handleDeleteNote(data.id)}
                />
              </div>
            </div>
          ))}
          <div className="addNote">
            <p
              onClick={displayNoteOnPopUp}
              className="plusSign"
              title="Add notes"
            >
              +
            </p>
          </div>
        </div>
      </div>
      {popUp && (
        <div className="note_section">
          <div className="formatNote" style={{ backgroundColor: noteColor }}>
            <MdOutlineCancel
              className="cancelIcon"
              title="Close"
              onClick={handleCancelNotePopUp}
            />
            <textarea
              className="displayTitle"
              placeholder="Enter title"
              value={noteTitle}
              style={{ backgroundColor: noteColor }}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <textarea
              className="displayDescription"
              placeholder="Enter description"
              value={noteDescription}
              style={{ backgroundColor: noteColor }}
              onChange={(e) => setNoteDescription(e.target.value)}
            />
            <CiSaveDown2
              className="saveIcon"
              onClick={handleSavingNote}
              title="Save"
            />
          </div>
        </div>
      )}
    </div>
  );
}
