import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageViewer from '../ImageViewer/ImageViewer';
import './HotelForm.css';

const HotelForm = ({ 
    formData, 
    setFormData, 
    handleSubmit: onSubmit, 
    isUpdate = false,
    message
}) => {
    const navigate = useNavigate();
    const [validationErrors, setValidationErrors] = useState({});
    const [previewMainPhoto, setPreviewMainPhoto] = useState(null);
    const [previewGalleryPhotos, setPreviewGalleryPhotos] = useState([]);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        
   
        if (!formData.name?.trim()) {
            errors.name = 'Hotel name is required';
        }
        if (!formData.description?.trim()) {
            errors.description = 'Hotel description is required';
        }
        if (!formData.address?.trim()) {
            errors.address = 'Hotel address is required';
        }
        if (!formData.latitude) {
            errors.latitude = 'Hotel latitude is required';
        }
        if (!formData.longitude) {
            errors.longitude = 'Hotel longitude is required';
        }
        if (!formData.price) {
            errors.price = 'Hotel price is required';
        }

   
        if (!isUpdate && !formData.mainPhoto) {
            errors.mainPhoto = 'Main photo is required';
        }

        if (formData.mainPhoto instanceof File) {
            const mainPhotoError = validateImages(formData.mainPhoto, 'Main photo');
            if (mainPhotoError) {
                errors.mainPhoto = mainPhotoError;
            }
        }

   
        if (formData.galleryPhotos?.length > 0) {
            const galleryErrors = [];
            formData.galleryPhotos.forEach((photo, index) => {
                if (photo instanceof File) {
                    const error = validateImages(photo, `Gallery photo ${index + 1}`);
                    if (error) galleryErrors.push(error);
                }
            });
            if (galleryErrors.length > 0) {
                errors.galleryPhotos = galleryErrors;
            }
        }

        return errors;
    };

    const validateImages = (file, type = 'image') => {
        const maxSize = 5 * 1024 * 1024; 
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        
        if (!file) return null;
        
        if (!allowedTypes.includes(file.type)) {
            return `Only JPG, JPEG and PNG files are allowed for ${type}`;
        }
        
        if (file.size > maxSize) {
            return `${type} size should not exceed 5MB`;
        }
        
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        setValidationErrors({});

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            await onSubmit(e);
        } catch (err) {
            if (err.response?.data?.errors) {
   
                setValidationErrors(err.response.data.errors);
            } else {
            
                setValidationErrors({ 
                    general: err.response?.data?.message || 'An error occurred' 
                });
            }
        }
    };

    const handleMainPhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const error = validateImages(file, 'Main photo');
            if (error) {
                setErrors(prev => ({ ...prev, mainPhoto: error }));
                e.target.value = ''; 
                return;
            }

            setFormData({
                ...formData,
                mainPhoto: file
            });
            setPreviewMainPhoto(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, mainPhoto: null }));
        }
    };

    const handleGalleryPhotosChange = (e) => {
        const files = Array.from(e.target.files);
        const galleryErrors = [];

        
        files.forEach((file, index) => {
            const error = validateImages(file, `Gallery photo ${index + 1}`);
            if (error) galleryErrors.push(error);
        });

        if (galleryErrors.length > 0) {
            setErrors(prev => ({ ...prev, galleryPhotos: galleryErrors }));
            e.target.value = ''; 
            return;
        }

        const updatedGalleryPhotos = [...(formData.galleryPhotos || []), ...files];
        setFormData({
            ...formData,
            galleryPhotos: updatedGalleryPhotos
        });

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewGalleryPhotos(prev => [...prev, ...newPreviews]);
        setErrors(prev => ({ ...prev, galleryPhotos: null }));
    };

    const removeGalleryPhoto = (index) => {
        const updatedGalleryPhotos = [...formData.galleryPhotos];
        updatedGalleryPhotos.splice(index, 1);
        
        setFormData({
            ...formData,
            galleryPhotos: updatedGalleryPhotos
        });

       
        if (previewGalleryPhotos[index]) {
            URL.revokeObjectURL(previewGalleryPhotos[index]);
            const updatedPreviews = [...previewGalleryPhotos];
            updatedPreviews.splice(index, 1);
            setPreviewGalleryPhotos(updatedPreviews);
        }
    };

  
    useEffect(() => {
        return () => {
            if (previewMainPhoto) {
                URL.revokeObjectURL(previewMainPhoto);
            }
            previewGalleryPhotos.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    return (
        <div className="dashboard-content">
            <div className="container py-4">
                <div className="card shadow-sm">
                    <div className="card-header bg-white py-3">
                        <h2 className="card-title mb-0">
                            {isUpdate ? 'Update Hotel' : 'Add New Hotel'}
                        </h2>
                    </div>
                    <div className="card-body">
                        {validationErrors.general && (
                            <div className="alert alert-danger" role="alert">
                                {validationErrors.general}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="hotel-form">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Hotel Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required
                                        />
                                        {validationErrors.name && (
                                            <div className="invalid-feedback">{validationErrors.name}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-group">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            className={`form-control ${validationErrors.description ? 'is-invalid' : ''}`}
                                            id="description"
                                            rows="4"
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            required
                                        />
                                        {validationErrors.description && (
                                            <div className="invalid-feedback">{validationErrors.description}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <input
                                            type="text"
                                            className={`form-control ${validationErrors.address ? 'is-invalid' : ''}`}
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            required
                                        />
                                        {validationErrors.address && (
                                            <div className="invalid-feedback">{validationErrors.address}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="latitude" className="form-label">Latitude</label>
                                        <input
                                            type="number"
                                            className={`form-control ${validationErrors.latitude ? 'is-invalid' : ''}`}
                                            id="latitude"
                                            value={formData.latitude}
                                            onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                                            required
                                            step="any"
                                        />
                                        {validationErrors.latitude && (
                                            <div className="invalid-feedback">{validationErrors.latitude}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="longitude" className="form-label">Longitude</label>
                                        <input 
                                            type="number" 
                                            className={`form-control ${validationErrors.longitude ? 'is-invalid' : ''}`}
                                            id="longitude"
                                            value={formData.longitude} 
                                            onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                                            required 
                                            min="-180"
                                            max="180"
                                            step="0.000001"
                                        />
                                        {validationErrors.longitude && (
                                            <div className="invalid-feedback">{validationErrors.longitude}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label">Price per Night</label>
                                        <div className="input-group">
                                            <span className="input-group-text">$</span>
                                            <input 
                                                type="number" 
                                                className={`form-control ${validationErrors.price ? 'is-invalid' : ''}`}
                                                value={formData.price} 
                                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                                required 
                                                min="0"
                                                step="0.01"
                                            />
                                            {validationErrors.price && (
                                                <div className="invalid-feedback">{validationErrors.price}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Main Photo</label>
                                        <input 
                                            type="file" 
                                            className={`form-control mb-2 ${errors.mainPhoto ? 'is-invalid' : ''}`}
                                            onChange={handleMainPhotoChange}
                                            accept="image/png, image/jpeg, image/jpg"
                                            required={!isUpdate}
                                        />
                                        {errors.mainPhoto && (
                                            <div className="invalid-feedback d-block">
                                                {errors.mainPhoto}
                                            </div>
                                        )}
                                        {(previewMainPhoto || formData.currentMainPhoto) && (
                                            <div className="image-preview">
                                                {previewMainPhoto ? (
                                                    <img 
                                                        src={previewMainPhoto} 
                                                        alt="Main photo preview" 
                                                        className="preview-image"
                                                    />
                                                ) : (
                                                    <ImageViewer 
                                                        imageName={formData.currentMainPhoto}
                                                        className="preview-image"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Gallery Photos</label>
                                        <input 
                                            type="file" 
                                            className={`form-control mb-2 ${errors.galleryPhotos ? 'is-invalid' : ''}`}
                                            onChange={handleGalleryPhotosChange}
                                            accept="image/png, image/jpeg, image/jpg"
                                            multiple
                                        />
                                        {errors.galleryPhotos && (
                                            <div className="invalid-feedback d-block">
                                                {Array.isArray(errors.galleryPhotos) 
                                                    ? errors.galleryPhotos.map((error, index) => (
                                                        <div key={index}>{error}</div>
                                                      ))
                                                    : errors.galleryPhotos
                                                }
                                            </div>
                                        )}
                                        <div className="gallery-preview">
                                         
                                            {formData.galleryPhotos?.map((photo, index) => (
                                                <div key={`existing-${index}`} className="gallery-item">
                                                    {photo instanceof File ? (
                                                        <img 
                                                            src={URL.createObjectURL(photo)} 
                                                            alt={`Gallery preview ${index + 1}`}
                                                            className="preview-image"
                                                        />
                                                    ) : (
                                                        <ImageViewer 
                                                            imageName={photo}
                                                            className="preview-image"
                                                        />
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="remove-photo"
                                                        onClick={() => removeGalleryPhoto(index)}
                                                    >
                                                        <i className="bi bi-x"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate('/dashboard')}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {isUpdate ? 'Update Hotel' : 'Add Hotel'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        {message && (
                            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mt-3`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelForm;