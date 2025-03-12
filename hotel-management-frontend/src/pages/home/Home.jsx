import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const Home = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <h1 className="display-3 fw-bold">Find Your Perfect Stay</h1>
                                <p className="lead mb-4">Discover amazing hotels and accommodations worldwide.</p>
                                <Link to="/hotels" className="btn btn-dark btn-lg">
                                    Browse Hotels
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Hotels Section */}
                <section className="featured-section py-5">
                    <div className="container">
                        <h2 className="text-center mb-5">Featured Hotels</h2>
                        <div className="row g-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="col-md-4">
                                    <div className="featured-card">
                                        <img src={`https://picsum.photos/400/300?random=${item}`} alt="Featured Hotel" />
                                        <div className="featured-content">
                                            <h3>Luxury Hotel {item}</h3>
                                            <p>Experience luxury and comfort in our prime locations.</p>
                                            <Link to="/hotels" className="btn btn-outline-dark">Learn More</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="features-section py-5 bg-light">
                    <div className="container">
                        <h2 className="text-center mb-5">Why Choose Us</h2>
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="feature-item text-center">
                                    <i className="bi bi-star-fill"></i>
                                    <h3>Quality Selection</h3>
                                    <p>hotels that meet our high standards.</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="feature-item text-center">
                                    <i className="bi bi-shield-check"></i>
                                    <h3>Best Price Guarantee</h3>
                                    <p>Find the best rates for your stay.</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="feature-item text-center">
                                    <i className="bi bi-headset"></i>
                                    <h3>24/7 Support</h3>
                                    <p>Here to help with bookings.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;