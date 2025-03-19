import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import TopNav from '../../../components/TopNav/TopNav';
import HotelForm from '../../../components/HotelForm/HotelForm';
import '../Hotel.css';
import axios from '../../../axiosToken';
const AddHotel = () => {
   
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [price, setPrice] = useState('');
    const [mainPhoto, setMainPhoto] = useState(null);
    const [galleryPhotos, setGalleryPhotos] = useState([]);
    const [message, setMessage] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('address', address);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('price', price);
        if (mainPhoto) {
            formData.append('mainPhoto', mainPhoto);
        }
        if (galleryPhotos.length > 0) {
            galleryPhotos.forEach(photo => {
                formData.append('galleryPhotos', photo);
            });
        }

        try {
            await axios.post('/api/user/hotels', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Hotel added successfully');
            navigate('/dashboard');
        } catch (err) {
            setMessage('Failed to add hotel');
        }
    };

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

                <HotelForm 
                    formData={{ name, description, address, latitude, longitude, price, mainPhoto, galleryPhotos }}
                    setFormData={(newData) => {
                        setName(newData.name);
                        setDescription(newData.description);
                        setAddress(newData.address);
                        setLatitude(newData.latitude);
                        setLongitude(newData.longitude);
                        setPrice(newData.price);
                        setMainPhoto(newData.mainPhoto);
                        setGalleryPhotos(newData.galleryPhotos);
                    }}
                    handleSubmit={handleSubmit}
                    isUpdate={false}
                    message={message}
                />
            </div>
        </div>
    );
};

export default AddHotel;