import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', phoneNumber: '' });
  const [showMessages, setShowMessages] = useState(false);
  const [showAddUserPanel, setShowAddUserPanel] = useState(false);
  const [showUserListPanel, setShowUserListPanel] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await axios.get('http://localhost:4000/userList');
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error occurred while fetching user list:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:4000/messages');
        setMessages(response.data.data);
      } catch (error) {
        console.error('Error occurred while fetching messages:', error);
      }
    };

    fetchUserList();
    fetchMessages();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const newUserDetails = {
      name: newUser.username,
      email: newUser.email,
      password: newUser.password,
      phoneNumber: newUser.phoneNumber
    };

    try {
      const response = await axios.post('http://localhost:4000/register', newUserDetails);

      if (response.status === 200) {
        // Registration successful
        const userData = response.data;
        setUsers([...users, userData]);
        setNewUser({ username: '', email: '', password: '', phoneNumber: '' });
      } else {
        // Registration failed
        console.error('Registration failed.');
      }
    } catch (error) {
      console.error('Error occurred while registering:', error);
    }
  };

  const handleRemoveUser = async (userEmail, index) => {
    try {
      await axios.delete(`http://localhost:4000/users/${userEmail}`);
      const updatedUsers = [...users];
      updatedUsers.splice(index, 1);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error occurred while deleting user:', error);
    }
  };
  
  

  const handleViewMessages = () => {
    setShowMessages(!showMessages);
  };

  const handleLogout = () => {
    // Handle logout logic here
    window.location.href = '/login';
  };

  return (
    <div className="admin-panel-container">
      <h2 className="admin-panel-title">Admin Panel</h2>
      <div className="admin-panel-content">
        {/* Users Panel */}
        <div className="Apanel">
          <h3 className="panel-title">Users</h3>
          <button className="panel-button" onClick={() => setShowUserListPanel(!showUserListPanel)}>
            {showUserListPanel ? 'Hide User List' : 'Show User List'}
          </button>
          {showUserListPanel && (
            <div className="panel-content">
              {users.length > 0 ? (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                        <button className="remove-user-button" onClick={() => handleRemoveUser(user.email, index)}>
  Remove
</button>


                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No users found.</p>
              )}
            </div>
          )}
        </div>

        {/* Messages Panel */}
        <div className="Apanel">
          <h3 className="panel-title">Messages</h3>
          <button className="panel-button" onClick={handleViewMessages}>
            {showMessages ? 'Hide Messages' : 'Show Messages'}
          </button>
          {showMessages && (
            <div className="panel-content">
              {messages.length > 0 ? (
                <table className="messages-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((message, index) => (
                      <tr key={index}>
                        <td>{message.email}</td>
                        <td>{message.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No messages found.</p>
              )}
            </div>
          )}
        </div>

        {/* Add User Panel */}
        <div className="Apanel">
          <h3 className="panel-title">Add User</h3>
          <button className="panel-button" onClick={() => setShowAddUserPanel(!showAddUserPanel)}>
            {showAddUserPanel ? 'Hide Add User' : 'Show Add User'}
          </button>
          {showAddUserPanel && (
            <div className="panel-content add-user-panel">
              <form onSubmit={handleAddUser}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Cell:</label>
                  <input
                    type="phoneNumber"
                    id="phoneNumber"
                    value={newUser.phoneNumber}
                    onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <button type="submit" className="add-user-button">
                  Add User
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
     
    </div>
  );
};

export default AdminPanel;