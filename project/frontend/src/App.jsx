import "./App.css";
import NoteList from './components/notes/NoteList';

const App = () => {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <NoteList />
    </main>
  );
};

export default App;

