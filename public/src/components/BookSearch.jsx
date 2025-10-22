import React, { useState } from 'react';

const BookSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('bookname'); // 'bookname', 'author', or 'genre'

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, searchType });
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search for books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
        <option value="bookname">Name</option>
        <option value="author">Author</option>
        <option value="genre">Genre</option>
      </select>
      <button type="submit">Search</button>
    </form>
  );
};

export default BookSearch;
