import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AddBookForm = () => {
  const [bookname, setBookname] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [availability, setAvailability] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'book-list'), {
        bookname,
        author,
        genre,
        cover_image_url: coverImageUrl,
        availability,
      });
      // Clear form
      setBookname('');
      setAuthor('');
      setGenre('');
      setCoverImageUrl('');
      setAvailability(true);
      alert('Book added successfully!');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding book.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Book</h3>
      <input type="text" placeholder="Book Name" value={bookname} onChange={(e) => setBookname(e.target.value)} required />
      <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
      <input type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} required />
      <input type="text" placeholder="Cover Image URL" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} required />
      <label>
        Available:
        <input type="checkbox" checked={availability} onChange={(e) => setAvailability(e.target.checked)} />
      </label>
      <button type="submit">Add Book</button>
    </form>
  );
};

export default AddBookForm;
