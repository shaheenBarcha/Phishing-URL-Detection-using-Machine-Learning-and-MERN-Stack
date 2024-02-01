import React, { useState, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const profileData = response.data.profile;

        setUsername(profileData.username);
        setEmail(profileData.email);
        setBio(profileData.bio);
        setProfilePicture(profileData.profilePicture);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // User is not authenticated, navigate to login page
          return <Navigate to="/login" />;
        } else {
          console.error('Failed to fetch profile data:', error);
        }
      }
    };

    fetchProfileData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedProfile = {
        username,
        email,
        bio,
      };

      const token = localStorage.getItem('token');

      const response = await axios.put('http://localhost:4000/profile', updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedProfileData = response.data.profile;

      setUsername(updatedProfileData.username);
      setEmail(updatedProfileData.email);
      setBio(updatedProfileData.bio);
      setProfilePicture(updatedProfileData.profilePicture);

      setIsEditing(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // User is not authenticated, navigate to login page
        return <Navigate to="/login" />;
      } else {
        console.error('Failed to update profile:', error);
      }
    }
  };
  
  return (
    <div className="profile-container">
      <div className="profile-box">
        <div className="profile-picture-container">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile Picture"
              className="profile-picture"
            />
          ) : (
            <div className="profile-placeholder"></div>
          )}
          {!isEditing && (
            <label className="profile-picture-label">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              Choose Picture
            </label>
          )}
        </div>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              readOnly={!isEditing}
            />
            <label>Name</label>
          </div>
          <div className="user-box">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              readOnly={!isEditing}
            />
            <label>Email</label>
          </div>
          <div className="user-box">
            <textarea
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              readOnly={!isEditing}
            ></textarea>
            <label>Bio</label>
          </div>
          {isEditing ? (
            <div className="button-group">
              <button type="submit">Save</button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" onClick={handleEdit}>
              Edit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;