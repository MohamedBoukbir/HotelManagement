import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import TopNav from '../../components/TopNav/TopNav';
import ImageViewer from '../../components/ImageViewer/ImageViewer';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import './Dashboard.css';
import axios from '../../axiosToken';
const hasRole = (userRole, roleToCheck) => {
    if (!userRole) return false;
    const roles = userRole.split(' ');
    return roles.includes(roleToCheck);
};

const Dashboard = () => {
    const [userHotels, setUserHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [message, setMessage] = useState(''); 
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        fetchUserHotels();
    }, []);

    const fetchUserHotels = async () => {
        try {
            const response = await axios.get('/api/hotels');
            if (response.status ===200){
                setUserHotels(response.data);
            } 
        } catch (err) {
            setError('Failed to fetch hotels');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (hotel) => {
        setSelectedHotel(hotel);
        setModalIsOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedHotel) {
            console.error('No hotel selected');
            return;
        }

        try {
            console.log('Deleting hotel:', selectedHotel.id);
            const response = await axios.delete(`/api/admin/hotels/${selectedHotel.id}`);
            
            if (response.status === 200) {
                console.log('Delete successful');
                
          
                setUserHotels(currentHotels => 
                    currentHotels.filter(hotel => hotel.id !== selectedHotel.id)
                );
                
             
                setMessage('Hotel deleted successfully');
        
                setModalIsOpen(false);
                setSelectedHotel(null);
            }
        } catch (err) {
            console.error('Delete error:', err.response || err);
            setMessage(err.response?.data?.message || 'Failed to delete hotel');
            setModalIsOpen(false);
            setSelectedHotel(null);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-wrapper">
            <button 
                className="mobile-menu-btn"
                onClick={toggleMobileSidebar}
            >
                <i className="bi bi-list"></i>
            </button>

            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar}
                userRole={userRole}
                isMobileOpen={isMobileSidebarOpen}
            />

            <div className={`dashboard-main ${isSidebarCollapsed ? 'expanded' : ''}`}>
                <TopNav 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />

                <div className="dashboard-content">
                    <div className="container py-5">
                        {message && (
                            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mb-4`}>
                                {message}
                            </div>
                        )}
                        <div className="dashboard-header d-flex justify-content-between align-items-center">
                            <h1 className="mb-4">My Hotels</h1>
                            <Link to="/hotels/create" className="btn btn-primary">
                                <i className="bi bi-plus-circle me-2"></i>Add New Hotel
                            </Link>
                        </div>

                        {userHotels.length === 0 ? (
                            <div className="no-hotels-message text-center">
                                <p>You haven't created any hotels yet.</p>
                                <Link to="/hotels/create" className="btn btn-outline-primary">
                                    Create Your First Hotel
                                </Link>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {userHotels.map((hotel) => (
                                    <div key={hotel.id} className="col-12 col-md-6 col-lg-4">
                                        <div className="hotel-card shadow-sm border rounded">
                                            <div className="hotel-image">
                                                <ImageViewer imageName={hotel.mainPhoto} />
                                            </div>
                                            <div className="hotel-content p-3">
                                                <h3>{hotel.name}</h3>
                                                <p className="text-muted">
                                                    <i className="bi bi-geo-alt-fill"></i> {hotel.address}
                                                </p>
                                                <p className="price">${hotel.price} / night</p>
                                                <div className="d-flex justify-content-between">
                                                    <Link to={`/hotels/${hotel.id}`} className="btn btn-outline-primary btn-sm">
                                                        <i className="bi bi-eye me-1"></i>View
                                                    </Link>
                                                    <Link 
                                                        to={`/hotels/edit/${hotel.id}`} 
                                                        state={{ 
                                                            hotel: {
                                                                ...hotel,
                                                                currentMainPhoto: hotel.mainPhoto,
                                                                currentGalleryPhotos: hotel.galleryPhotos // Ajout des photos de la galerie
                                                            }
                                                        }} 
                                                        className="btn btn-outline-secondary btn-sm"
                                                    >
                                                        <i className="bi bi-pencil me-1"></i>Edit
                                                    </Link>
                                                    {hasRole(userRole, 'ADMIN') && (
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleDeleteClick(hotel)}
                                                        >
                                                            <i className="bi bi-trash me-1"></i>Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DeleteConfirmationModal 
                isOpen={modalIsOpen}
                onClose={() => {
                    setModalIsOpen(false);
                    setSelectedHotel(null);
                }}
                onConfirm={handleDeleteConfirm}
                hotelName={selectedHotel?.name}
            />
        </div>
    );
};

export default Dashboard;
