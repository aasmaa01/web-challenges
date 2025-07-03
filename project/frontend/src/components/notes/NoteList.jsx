import { useState } from 'react';
import { sampleNotes } from '../../data/sampleNotes';
import NoteItem from './NoteItem';

const user = 'Sarah'; 

const NoteList = () => {
  const [notes,setNotes] = useState(sampleNotes);
  const [showUserNotes, setShowUserNotes] = useState(false);

  const filteredNotes = showUserNotes
    ? notes.filter((note) => note.authorName === user)
    : notes;

  const changeShowUserNotesStateOnClick = () => setShowUserNotes((prev) => !prev);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {showUserNotes ? 'My Notes' : 'All Notes'}
        </h2>

        <div className="flex items-center gap-4">
          <button
            onClick={changeShowUserNotesStateOnClick}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
          >
            Show {showUserNotes ? 'All Notes' : 'My Notes'}
          </button>

          <span className="text-sm text-gray-600">
            Total: {filteredNotes.length}
          </span>

        </div>
      </div>

       {filteredNotes.length === 0 ? (
        <p className="text-center text-gray-500">No notes available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;


