import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Hotels.css';
import ImageViewer from '../../components/ImageViewer/ImageViewer';

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const response = await axios.get('/api/hotels');
            setHotels(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching hotels:', err);
            setError('Failed to load hotels');
            setLoading(false);
        }
    };

    const handleShow = (hotel) => {
        setSelectedHotel(hotel);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedHotel(null);
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="hotels-container flex-grow-1">
                <div className="container py-5">
                    <div className="hotels-header text-center mb-5">
                        <h1 className="display-4">Discover Our Hotels</h1>
                        <p className="lead text-muted">Find your perfect stay from our carefully curated collection</p>
                    </div>

                    {loading && (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="row g-4">
                            {hotels.map(hotel => (
                                <div className="col-md-6 col-lg-4" key={hotel.id}>
                                    <div className="hotel-card">
                                        <div className="hotel-image-container">
                                        <ImageViewer imageName={hotel.mainPhoto} />
                                            <div className="hotel-price">
                                                <span>${hotel.price}</span>
                                                <small>/night</small>
                                            </div>
                                        </div>
                                        <div className="hotel-content">
                                            <h3>{hotel.name}</h3>
                                            <p className="location">
                                                <i className="bi bi-geo-alt-fill"></i> {hotel.address}
                                            </p>
                                            <p className="description">{hotel.description}</p>
                                            <div className="gallery-preview mb-3">
                                                {hotel.galleryPhotos.map((photo, index) => (
                                                    <ImageViewer 
                                                    key={`${hotel.id}-photo-${index}`} 
                                                    imageName={photo} />
                                                ))}
                                            </div>
                                            <div className="hotel-actions">
                                                <Link to={`/hotels/${hotel.id}`} className="btn btn-primary">
                                                    <i className="bi bi-info-circle me-2"></i>Details
                                                </Link>
                                                <button 
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => handleShow(hotel)}
                                                >
                                                    <i className="bi bi-geo-alt me-2"></i>Location
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showModal && selectedHotel && (
                  <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflow: 'auto' }}>
                  <div className="modal-dialog modal-dialog-centered modal-lg">
                      <div className="modal-content">
                          <div className="modal-header">
                              <h5 className="modal-title">{selectedHotel.name} Location</h5>
                              <button type="button" className="btn-close" onClick={handleClose}></button>
                          </div>
                          <div className="modal-body">
                              <div className="row">
                                  <div className="col-md-6">
                                      <p><strong>Address:</strong> {selectedHotel.address}</p>
                                      <p><strong>Latitude:</strong> {selectedHotel.latitude}</p>
                                      <p><strong>Longitude:</strong> {selectedHotel.longitude}</p>
                                  </div>
                                  <div className="col-md-12">
                                      <div className="map-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                                          <iframe
                                              width="100%"
                                              height="100%"
                                              frameBorder="0"
                                              style={{ 
                                                  border: 0,
                                                  position: 'absolute',
                                                  top: 0,
                                                  left: 0,
                                                  width: '100%',
                                                  height: '100%'
                                              }}
                                              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${selectedHotel.latitude},${selectedHotel.longitude}`}
                                              allowFullScreen
                                          ></iframe>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                          </div>
                      </div>
                  </div>
              </div>
            )}

            {/* Image Preview Modal */}
            {selectedImage && (
                <div 
                    className="image-preview-modal"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="image-preview-content">
                        <button 
                            className="close-button"
                            onClick={() => setSelectedImage(null)}
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                        <img src={selectedImage} alt="Preview" />
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Hotels;