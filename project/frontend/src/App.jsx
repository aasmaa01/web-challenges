import "./App.css";
import Header from './components/layout/Header';
import NoteList from './components/notes/NoteList';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="py-10 px-4">
        <NoteList />
      </main>
    </div>
  );
};

export default App;

