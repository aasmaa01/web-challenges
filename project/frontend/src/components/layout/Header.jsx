const Header = () => {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo or Title */}
        <h1 className="text-2xl font-bold text-blue-600">CollabNote</h1>
        
        <nav className="flex items-center gap-4">
          {/* Placeholder for future buttons */}
          <button className="text-sm text-gray-600 hover:text-blue-600 transition">
            Sign In
          </button>
          <button className="text-sm text-gray-600 hover:text-blue-600 transition">
            Sign Up
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
