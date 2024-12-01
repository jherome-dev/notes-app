import { useNavigate } from "react-router-dom";
import ProfileInfo from "../Card/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className=" bg-white drop-shadow">
      <nav className=" container mx-auto px-6 py-5">
        <div className="flex items-center justify-between space-x-4">
          <h3 className="text-lg">Notes</h3>

          {/* Search Bar always visible */}
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
            className="ml-2 px-2"
          />

          {/* Hamburger Icon for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    !isOpen ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"
                  }
                />
              </svg>
            </button>
          </div>

          {/* ProfileInfo for desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
          </div>
        </div>

        {/* Dropdown Menu for mobile (only ProfileInfo) */}
        {isOpen && (
          <div className="md:hidden mt-4">
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
