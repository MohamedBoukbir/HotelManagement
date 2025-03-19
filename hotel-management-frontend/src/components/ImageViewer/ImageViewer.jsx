import React, { useEffect, useState } from 'react';
import axios from '../../axios';

const ImageViewer = ({ imageName }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(`api/uploads/${imageName}`, {
                    responseType: 'blob'
                });
                const blob = response.data;
                const url = URL.createObjectURL(blob); 
                setImageUrl(url);
            } catch (error) {
                console.error('Error loading image:', error);
            }
        };

        if (imageName) {
            fetchImage();
        }
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
                <img 
                    src={imageUrl} 
                    alt="Hotel image" 
                    style={{ width: '100%', maxWidth: '400px' }} 
                />
            ) : (
                <p>Loading image...</p>
            )}
        </div>
    );
};

export default ImageViewer;