import React, { useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const location = useLocation();
    const currentPath = location.pathname.toLowerCase();

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    };

    useEffect(() => {
        const token = localStorage.getItem('token'); 
        if (token) {
            setIsLoggedIn(true);
        }
    }, [setIsLoggedIn]); 

    const isActive = (path) => {
        if (path === '/') return currentPath === '/';
        return currentPath === path.toLowerCase();
    };

    return (
        <div className="navbar-container">
            <div className="navbar">
                <Link to="/" className="nav-left" style={{ textDecoration: 'none' }}>
                    <span className="nav-brand">SkyVoyage</span>
                    <FontAwesomeIcon icon={faPlane} className="nav-brand-icon" />
                </Link>
                <div className="nav-right">
                    <Link to="/" className={isActive('/') ? 'nav-active' : ''}>Book Flights</Link>
                    <Link to="/FlightStatus" className={isActive('/FlightStatus') ? 'nav-active' : ''}>Flight Status</Link>
                    <Link to="/CheckIn" className={isActive('/CheckIn') ? 'nav-active' : ''}>Check-in</Link>
                    <Link to="/Reviews_Ratings" className={isActive('/Reviews_Ratings') ? 'nav-active' : ''}>Reviews</Link>
                    <Link to="/RR" className={isActive('/RR') ? 'nav-active' : ''}>Feedback</Link>
                    {isLoggedIn ? (
                        localStorage.getItem('username') === 'admin' ? (
                            <Link to="/Admin" className={isActive('/Admin') ? 'nav-active' : ''}>Dashboard</Link>
                        ) : (
                            <Link to="/Profile" className={isActive('/Profile') ? 'nav-active' : ''}>Profile</Link>
                        )
                    ) : (
                        <Link to="/login" className={isActive('/login') ? 'nav-active' : ''}>Login</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
