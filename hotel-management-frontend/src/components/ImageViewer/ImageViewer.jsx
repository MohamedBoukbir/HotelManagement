import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';


const ImageViewer = ({ imageName }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImage = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/signin');
                return;
            }
            try {
                const response = await axios.get(`api/uploads/${imageName}`, {
                    responseType: 'blob',
                });
                const blob = response.data;
                const url = URL.createObjectURL(blob); 
                setImageUrl(url);
            } catch (error) {
                console.error('Error when you create the Image', error);
            }
        };

        fetchImage();
    }, [imageName]);

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    return (
        <div>
            {imageUrl ? (
                <img src={imageUrl} alt="Hotel image" style={{ width: '100%', maxWidth: '400px' }} />
            ) : (
                <p>Load image...</p>
            )}
        </div>
    );
};

export default ImageViewer;