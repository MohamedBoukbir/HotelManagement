import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3 bg-dark text-white">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h5>About Us</h5>
                        <p>Your trusted hotel management system providing excellent service since 2024.</p>
                    </div>
                    <div className="col-md-4">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/" className="text-white">Home</a></li>
                            <li><a href="/hotels" className="text-white">Hotels</a></li>
                            <li><a href="/contact" className="text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Contact Info</h5>
                        <ul className="list-unstyled">
                            <li>Email: info@hmanagement.com</li>
                            <li>Phone: +1 234 567 890</li>
                            <li>Address: 123 Hotel Street, City</li>
                        </ul>
                    </div>
                </div>
                <hr className="mt-4" />
                <div className="row">
                    <div className="col text-center">
                        <p className="mb-0">&copy; 2024 Hotel Management System. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;