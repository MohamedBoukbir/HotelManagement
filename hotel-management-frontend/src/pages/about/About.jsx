import React from 'react';

import './About.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const About = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="about-container flex-grow-1">
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="about-header text-center mb-5">
                                <h1 className="display-4">About Us</h1>
                                <p className="lead">Discover Our Story and Mission</p>
                            </div>

                            <div className="row mb-5 align-items-center">
                                <div className="col-md-6 mb-4 mb-md-0">
                                    <img 
                                        src="https://picsum.photos/600/400" 
                                        alt="About Us" 
                                        className="img-fluid rounded shadow-lg"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <h2 className="mb-4">Our Story</h2>
                                    <p>Founded in 2024, our hotel management system has been dedicated to providing exceptional service and unforgettable experiences to our guests.</p>
                                    <p>We believe in creating memorable stays through attention to detail and personalized service.</p>
                                </div>
                            </div>

                            <div className="features-section py-5">
                                <h2 className="text-center mb-5">Why Choose Us</h2>
                                <div className="row g-4">
                                    <div className="col-md-4">
                                        <div className="feature-card">
                                            <i className="bi bi-star-fill"></i>
                                            <h3>Quality Service</h3>
                                            <p>We ensure the highest standards of service quality.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="feature-card">
                                            <i className="bi bi-shield-check"></i>
                                            <h3>Trusted Platform</h3>
                                            <p>Security and reliability are at the core of our booking platform.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="feature-card">
                                            <i className="bi bi-heart-fill"></i>
                                            <h3>Customer Focus</h3>
                                            <p>Your satisfaction is our top priority in everything we do.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="team-section py-5">
                                <h2 className="text-center mb-5">Our Team</h2>
                                <div className="row g-4">
                                    {[1, 2, 3].map((member) => (
                                        <div key={member} className="col-md-4">
                                            <div className="team-card">
                                                <img 
                                                    src={`https://picsum.photos/200/200?random=${member}`} 
                                                    alt={`Team Member ${member}`} 
                                                    className="team-image"
                                                />
                                                <h4>John Doe</h4>
                                                <p className="text-muted">Position</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;