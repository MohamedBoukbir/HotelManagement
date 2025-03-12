import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './HotelDetails.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const HotelDetails = () => {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(null);


    const hotel = {
        id: 1,
        name: 'Hotel Sunshine',
        description: 'Experience luxury and comfort in our beautifully designed rooms with stunning city views. Our hotel offers exceptional amenities including a rooftop pool, spa, fitness center, and gourmet restaurants.',
        address: '123 Sunshine St, Sunnyville',
        latitude: 34.0522,
        longitude: -118.2437,
        price: 120.00,
        mainPhoto: 'https://picsum.photos/800/500',
        galleryPhotos: [
            'https://picsum.photos/800/600',
            'https://picsum.photos/800/600',
            'https://picsum.photos/800/600',
            'https://picsum.photos/800/600'
        ],
        amenities: [
            'Free WiFi',
            'Swimming Pool',
            'Spa',
            'Fitness Center',
            'Restaurant',
            'Room Service',
            'Parking',
            'Bar/Lounge'
        ],
        rooms: [
            { type: 'Standard Room', price: 120, description: 'Comfortable room with city view' },
            { type: 'Deluxe Room', price: 180, description: 'Spacious room with premium amenities' },
            { type: 'Suite', price: 250, description: 'Luxury suite with separate living area' }
        ]
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="hotel-details-container flex-grow-1">
                <div className="container py-5">
                    {/* Hotel Header */}
                    <div className="hotel-header mb-5">
                        <h1 className="display-4 mb-3">{hotel.name}</h1>
                        <p className="lead text-muted">
                            <i className="bi bi-geo-alt-fill"></i> {hotel.address}
                        </p>
                    </div>

                    {/* Main Photo and Gallery */}
                    <div className="row mb-5">
                        <div className="col-md-8 mb-4 mb-md-0">
                            <div className="main-photo-container">
                                <img 
                                    src={hotel.mainPhoto} 
                                    alt={hotel.name}
                                    className="main-photo"
                                    onClick={() => setSelectedImage(hotel.mainPhoto)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="gallery-grid">
                                {hotel.galleryPhotos.map((photo, index) => (
                                    <div key={index} className="gallery-item">
                                        <img 
                                            src={photo} 
                                            alt={`Gallery ${index + 1}`}
                                            onClick={() => setSelectedImage(photo)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Hotel Information */}
                    <div className="row">
                        <div className="col-lg-8">
                            {/* Description */}
                            <section className="mb-5">
                                <h2 className="section-title">Description</h2>
                                <p className="description">{hotel.description}</p>
                            </section>

                            {/* Amenities */}
                            <section className="mb-5">
                                <h2 className="section-title">Amenities</h2>
                                <div className="row">
                                    {hotel.amenities.map((amenity, index) => (
                                        <div key={index} className="col-md-6 col-lg-4 mb-2">
                                            <div className="amenity-item">
                                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                {amenity}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Location */}
                            <section className="mb-5">
                                <h2 className="section-title">Location</h2>
                                <div className="map-container">
                                    <iframe
                                        title="Hotel Location"
                                        width="100%"
                                        height="400"
                                        frameBorder="0"
                                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${hotel.latitude},${hotel.longitude}`}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </section>
                        </div>

                        {/* Booking Sidebar */}
                        <div className="col-lg-4">
                            <div className="booking-sidebar">
                                <h3>Available Rooms</h3>
                                {hotel.rooms.map((room, index) => (
                                    <div key={index} className="room-card">
                                        <h4>{room.type}</h4>
                                        <p>{room.description}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="price">${room.price}/night</span>
                                            <button className="btn btn-primary">Book Now</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Preview Modal */}
                {selectedImage && (
                    <div className="modal show d-block" onClick={() => setSelectedImage(null)}>
                        <div className="modal-dialog modal-dialog-centered modal-xl">
                            <div className="modal-content">
                                <div className="modal-body p-0">
                                    <button 
                                        type="button" 
                                        className="btn-close position-absolute top-0 end-0 m-2" 
                                        onClick={() => setSelectedImage(null)}
                                    ></button>
                                    <img 
                                        src={selectedImage} 
                                        alt="Preview" 
                                        className="img-fluid w-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default HotelDetails;