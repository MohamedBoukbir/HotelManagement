import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import TopNav from '../../../components/TopNav/TopNav';
import HotelForm from '../../../components/HotelForm/HotelForm';
import '../Hotel.css';
import axios from '../../../axiosToken';

const UpdateHotel = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [price, setPrice] = useState('');
    const [mainPhoto, setMainPhoto] = useState(null);
    const [currentMainPhoto, setCurrentMainPhoto] = useState('');
    const [galleryPhotos, setGalleryPhotos] = useState([]);
    const [message, setMessage] = useState('');


    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    useEffect(() => {
        if (location.state?.hotel) {
            const hotel = location.state.hotel;
            setName(hotel.name);
            setDescription(hotel.description);
            setAddress(hotel.address);
            setLatitude(hotel.latitude);
            setLongitude(hotel.longitude);
            setPrice(hotel.price);
            setCurrentMainPhoto(hotel.mainPhoto);
            setGalleryPhotos(hotel.galleryPhotos || []);
        } else {
            fetchHotelDetails();
        }
    }, [id, location]);

    const fetchHotelDetails = async () => {
        try {
            const response = await axios.get(`/api/user/hotels/${id}`);
            const hotel = response.data;
            setName(hotel.name);
            setDescription(hotel.description);
            setAddress(hotel.address);
            setLatitude(hotel.latitude);
            setLongitude(hotel.longitude);
            setPrice(hotel.price);
            setCurrentMainPhoto(hotel.mainPhoto);
            setGalleryPhotos(hotel.galleryPhotos || []);
        } catch (err) {
            setMessage('Failed to fetch hotel details');
            navigate('/dashboard');
        }
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
        
        if (galleryPhotos && galleryPhotos.length > 0) {
            galleryPhotos.forEach((photo, index) => {
                if (photo instanceof File) {
                    formData.append('galleryPhotos', photo);
                }
            });
        }

        try {
            await axios.put(`/api/user/hotels/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Hotel updated successfully');
            navigate('/dashboard');
        } catch (err) {
            setMessage('Failed to update hotel');
            console.error(err);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
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
                    formData={{ 
                        name, 
                        description, 
                        address, 
                        latitude, 
                        longitude, 
                        price, 
                        mainPhoto,
                        currentMainPhoto,
                        galleryPhotos 
                    }}
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
                    isUpdate={true}
                    message={message}
                />
            </div>
        </div>
    );
};

export default UpdateHotel;