import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, app } from '../firebase';

const auth = getAuth(app);

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      const user = auth.currentUser;
      if (user) {
        const borrowDataRef = collection(db, 'borrow-data');
        const q = query(borrowDataRef, where('userid', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const borrowedBooksData = await Promise.all(querySnapshot.docs.map(async (borrowDoc) => {
          const borrowData = borrowDoc.data();
          const bookDocRef = doc(db, 'book-list', borrowData.bookid);
          const bookDocSnap = await getDoc(bookDocRef);
          const bookData = bookDocSnap.data();

          // Calculate remaining/overdue days
          const borrowDate = new Date(borrowData.borrowdate.split('.').reverse().join('-'));
          const deadline = new Date(borrowDate);
          deadline.setDate(deadline.getDate() + 24);
          const today = new Date();
          const diffTime = deadline - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return {
            ...bookData,
            remainingDays: diffDays > 0 ? diffDays : 0,
            overdueDays: diffDays < 0 ? Math.abs(diffDays) : 0,
          };
        }));
        setBorrowedBooks(borrowedBooksData);
      }
      setLoading(false);
    };

    fetchBorrowedBooks();
  }, []);

  if (loading) {
    return <div>Loading borrowed books...</div>;
  }

  return (
    <div>
      <h3>Your Borrowed Books</h3>
      <table>
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Remaining Days</th>
            <th>Overdue Days</th>
          </tr>
        </thead>
        <tbody>
          {borrowedBooks.map((book, index) => (
            <tr key={index}>
              <td>{book.bookname}</td>
              <td>{book.remainingDays}</td>
              <td>{book.overdueDays}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowedBooks;
