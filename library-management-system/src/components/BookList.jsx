import React from 'react';

const BookList = ({ books, onBookSelect }) => {
  return (
    <div>
      {books.map((book) => (
        <div key={book.id} onClick={() => onBookSelect(book)}>
          <h3>{book.bookname}</h3>
          <p>{book.author}</p>
        </div>
      ))}
    </div>
  );
};

export default BookList;
