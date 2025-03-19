import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, toggleSidebar, userRole }) => {
    return (
        <div className={`dashboard-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!isCollapsed && <h3>Hotel Management</h3>}
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <i className={`bi bi-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
                </button>
            </div>
            <div className="sidebar-menu">
                <Link to="/dashboard" className="menu-item">
                    <i className="bi bi-speedometer2"></i>
                    {!isCollapsed && <span>Dashboard</span>}
                </Link>
                <Link to="/dashboard/hotels" className="menu-item">
                    <i className="bi bi-building"></i>
                    {!isCollapsed && <span>Hotels</span>}
                </Link>
                {userRole === 'ADMIN' && (
                    <Link to="/dashboard/users" className="menu-item">
                        <i className="bi bi-people"></i>
                        {!isCollapsed && <span>Users</span>}
                    </Link>
                )}
                <Link to="/hotels/create" className="menu-item">
                    <i className="bi bi-plus-circle"></i>
                    {!isCollapsed && <span>Add Hotel</span>}
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;