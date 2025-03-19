import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TopNav.css';

const TopNav = ({ searchTerm, setSearchTerm }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        

        navigate('/login');
    };

    return (
        <div className="dashboard-topnav">
            <div className="search-box">
                <i className="bi bi-search"></i>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="user-profile">
                <div className="notifications">
                    <i className="bi bi-bell"></i>
                    <span className="badge">3</span>
                </div>
                <div className="profile-dropdown">
                    <img src="https://picsum.photos/400/300" alt="Profile" className="profile-image" />
                    <div className="dropdown-content">
                        <Link to="/profile">My Profile</Link>
                        <Link to="/settings">Settings</Link>
                        <button 
                            className="dropdown-item"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopNav;