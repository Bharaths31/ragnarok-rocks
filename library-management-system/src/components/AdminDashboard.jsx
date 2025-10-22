import React from 'react';
import AddBookForm from './AddBookForm';
import EditableBookList from './EditableBookList';

const AdminDashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <AddBookForm />
      <hr />
      <EditableBookList />
    </div>
  );
};

export default AdminDashboard;
