
const NoteItem = ({ note }) => {

  const privacyIndicatorColor  = note.isPublic ? 'bg-green-500' : 'bg-orange-500';
  const displayedContent = note.content.length > 100 ? note.content.slice(0, 100) + '...' : note.content;
  const readableCreateDate = new Date(note.createdAt).toLocaleDateString();
  const noteAuthor = note.authorName || 'Unknown';
  
  return (
    <div className="bg-white border border-gray-400 shadow-md hover:shadow-lg transition-shadow p-6 rounded-md h-64 flex flex-col justify-between cursor-pointer">

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{note.title}</h3>
        <p className="text-sm text-gray-700 mb-4 line-clamp-4">{displayedContent}</p>
      </div>

      <div className="flex justify-between items-center text-xs mt-auto">
        <div className="text-gray-600">
          <p>Author : {noteAuthor}</p>
          <p>Created: {readableCreateDate}</p>
        </div>

        <span className={`text-white font-bold px-2 py-1 rounded ${privacyIndicatorColor}`}>
          {note.isPublic ? 'Public' : 'Private'}
        </span>
      </div>

    </div>
  );
};

export default NoteItem;
