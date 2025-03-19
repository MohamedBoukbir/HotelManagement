import React, { useState, useEffect } from 'react';
import { Image, ActivityIndicator, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ImageViewer = ({ imageName, style, resizeMode = 'cover' }) => {
    const [loading, setLoading] = useState(true);
    const [authHeader, setAuthHeader] = useState(null);

    const imageUrl = `http://192.168.1.128:8085/api/uploads/${imageName}`;

    useEffect(() => {
        const fetchAuthHeader = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                setAuthHeader(token ? { Authorization: `Bearer ${token}` } : {});
            } catch (error) {
                console.error('Error getting auth token:', error);
                setAuthHeader({});
            }
        };
        fetchAuthHeader();
    }, []);

    if (!imageName) {
        return (
            <View style={[style, { backgroundColor: '#f5f6fa', justifyContent: 'center', alignItems: 'center' }]}>
                <MaterialIcons name="image-not-supported" size={24} color="#bdc3c7" />
            </View>
        );
    }

    return (
        <View style={style}>
            {authHeader ? (
                <Image
                    source={{
                        uri: imageUrl,
                        headers: authHeader,
                    }}
                    style={[style, { position: 'absolute', top: 0, left: 0 }]}
                    resizeMode={resizeMode}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    onError={(error) => {
                        console.error('Image loading error:', error);
                        setLoading(false);
                    }}
                />
            ) : null}
            {loading && (
                <View
                    style={[
                        style,
                        {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f5f6fa',
                        },
                    ]}
                >
                    <ActivityIndicator size="large" color="#3498db" />
                </View>
            )}
        </View>
    );
};

export default ImageViewer;