import React from 'react';

const BookDetailsModal = ({ book, onClose }) => {
  if (!book) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <img src={book.cover_image_url} alt={book.bookname} />
        <h2>{book.bookname}</h2>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Genre:</strong> {book.genre}</p>
        <p><strong>Availability:</strong> {book.availability ? 'Available' : 'Not Available'}</p>
      </div>
    </div>
  );
};

export default BookDetailsModal;
