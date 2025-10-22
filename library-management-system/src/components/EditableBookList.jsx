import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const EditableBookList = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, 'book-list'));
      setBooks(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchBooks();
  }, []);

  const handleUpdate = async (bookId, updatedData) => {
    const bookRef = doc(db, 'book-list', bookId);
    await updateDoc(bookRef, updatedData);
    setEditingBook(null);
    // Refresh the list
    const querySnapshot = await getDocs(collection(db, 'book-list'));
    setBooks(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const bookRef = doc(db, 'book-list', bookId);
      await deleteDoc(bookRef);
      // Refresh the list
      const querySnapshot = await getDocs(collection(db, 'book-list'));
      setBooks(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
  };

  return (
    <div>
      <h3>Editable Book List</h3>
      {books.map((book) => (
        <div key={book.id}>
          {editingBook?.id === book.id ? (
            <EditBookForm book={book} onUpdate={handleUpdate} onCancel={() => setEditingBook(null)} />
          ) : (
            <div>
              <span>{book.bookname} by {book.author}</span>
              <button onClick={() => setEditingBook(book)}>Edit</button>
              <button onClick={() => handleDelete(book.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const EditBookForm = ({ book, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({ ...book });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(book.id, formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="bookname" value={formData.bookname} onChange={handleChange} />
      <input type="text" name="author" value={formData.author} onChange={handleChange} />
      <input type="text" name="genre" value={formData.genre} onChange={handleChange} />
      <input type="text" name="cover_image_url" value={formData.cover_image_url} onChange={handleChange} />
      <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EditableBookList;
