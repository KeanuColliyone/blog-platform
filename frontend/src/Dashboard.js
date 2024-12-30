import React from 'react';

const Dashboard = () => {
  // Simulate fetching user data
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {user ? (
        <div>
          <h2>Hello, {user.name}!</h2>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>No user information available. Please log in.</p>
      )}
    </div>
  );
};

export default Dashboard;