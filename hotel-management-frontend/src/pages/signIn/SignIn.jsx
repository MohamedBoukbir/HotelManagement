import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './SignIn.css';
import axios from '../../axios';

const SignIn = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('/auth/login',formData);
            if (response.status ===200){
            const token = response.data['access-token'] || response.data.token || response.data;
            
            const parts = token.split('.');
            const payload = JSON.parse(atob(parts[1]));
                    console.log('JWT Payload decoded:', payload);
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', payload.sub);
                    localStorage.setItem('userRole', payload.scope);
       
            navigate('/dashboard');
            }
        } catch (err) {
          setError("Invalid username or password"); 

        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="signin-container flex-grow-1 d-flex align-items-center py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-5">
                            <div className="card shadow-lg border-0">
                                <div className="card-body p-5">
                                    <h2 className="text-center mb-4">Sign In</h2>
                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )}
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="username" className="form-label">Username</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3 form-check">
                                            <input type="checkbox" className="form-check-input" id="remember" />
                                            <label className="form-check-label" htmlFor="remember">Remember me</label>
                                        </div>
                                        <button type="submit" className="btn btn-dark w-100 mb-3">Sign In</button>
                                        <div className="text-center">
                                            <Link to="/forgot-password" className="text-dark text-decoration-none">Forgot password?</Link>
                                        </div>
                                    </form>
                                    <div className="mt-4 text-center">
                                        <p className="mb-0">Don't have an account? <Link to="/register" className="text-dark">Register</Link></p>
                                    </div>
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

export default SignIn;