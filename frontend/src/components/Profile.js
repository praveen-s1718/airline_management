import React, { useState, useEffect } from 'react';
import _Header from './ProfileHeader';
import '../profile.css';
import suitcase from './suitcase.webp';
import { useNavigate, Link } from 'react-router-dom';

const Profile = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    phoneNumber: '',
    email: ''
  });
  
  const UserName = localStorage.getItem('username');

  useEffect(() => {
    fetchProfileData();
  }, [UserName]);

  const fetchProfileData = () => {
    fetch(`https://airline-management-tco0.onrender.com/api/passengers/${UserName}`)
      .then(response => response.json())
      .then(data => {
        const { name, username, contact, email } = data;
        setProfileData({
          name: name || '',
          username: username || '',
          phoneNumber: contact || '',
          email: email || ''
        });
      })
      .catch(error => {
        console.error('Error fetching the profile data:', error);
      });
  };

  const handleClick = () => {
    navigate('/Trips');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }
    navigate('/login');
  };

  return (
    <div className='outerDiv'>
      <div className='container_1'>
        <_Header username={UserName} />
        <div className="profile-details" id="profile-details" style={{ width: '100%', marginBottom: '20px' }}>
          <div className="details">
            <div className="detail-item">
              <label>Name:</label>
              <input type="text" value={profileData.name} readOnly />
            </div>
            <div className="detail-item">
              <label>Username:</label>
              <input type="text" value={profileData.username} readOnly />
            </div>
            <div className="detail-item">
              <label>Phone Number:</label>
              <input type="text" value={profileData.phoneNumber} readOnly />
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <input type="email" value={profileData.email} readOnly />
            </div>
          </div>
        </div>
        
        <div className="profile-section" id="profile-section-id">
          <div id="my-trips-btn" className="btn-secondary" onClick={handleClick} style={{cursor: 'pointer'}}>
            <img src={suitcase} alt="Suitcase" />
            <div className="text" >My Trips</div>
          </div>
          <Link to="/" id='nav' className='button2'>Book Flights</Link>
          <button className='button1' onClick={handleLogout} style={{ marginTop: '15px', backgroundColor: '#e63946', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
