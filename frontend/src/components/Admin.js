import React from 'react';
import { useNavigate } from 'react-router-dom';
import Admin1 from './Admin1';
import Admin2 from './Admin2';
import '../admin.css';

const Admin = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div>
            <div className="header_4">
                <div className="admin-header-container">
                    <h1>Flight Booking System Admin</h1>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            <Admin1 />
            <Admin2 />
        </div>
    );
};

export default Admin;
