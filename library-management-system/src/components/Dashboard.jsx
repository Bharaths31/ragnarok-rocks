import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import BookSearch from './BookSearch';
import BookList from './BookList';
import BookDetailsModal from './BookDetailsModal';
import BorrowedBooks from './BorrowedBooks';
import './Dashboard.css';

const Dashboard = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const cachedBooks = localStorage.getItem('bookList');
      const cacheTimestamp = localStorage.getItem('bookListTimestamp');
      const now = new Date().getTime();

      if (cachedBooks && cacheTimestamp && (now - cacheTimestamp < 30 * 60 * 1000)) {
        setAllBooks(JSON.parse(cachedBooks));
        setFilteredBooks(JSON.parse(cachedBooks));
      } else {
        const querySnapshot = await getDocs(collection(db, 'book-list'));
        const booksData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllBooks(booksData);
        setFilteredBooks(booksData);
        localStorage.setItem('bookList', JSON.stringify(booksData));
        localStorage.setItem('bookListTimestamp', now);
      }
    };
    fetchBooks();
  }, []);

  const handleSearch = ({ searchTerm, searchType }) => {
    const filtered = allBooks.filter((book) =>
      book[searchType].toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <BookSearch onSearch={handleSearch} />
      <BookList books={filteredBooks} onBookSelect={handleBookSelect} />
      <BookDetailsModal book={selectedBook} onClose={handleCloseModal} />
      <hr />
      <BorrowedBooks />
    </div>
  );
};

export default Dashboard;
