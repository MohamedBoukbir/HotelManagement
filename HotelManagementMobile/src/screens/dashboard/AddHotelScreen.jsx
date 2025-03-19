import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  SafeAreaView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../services/axiosToken';
import EventEmitter from '../../utils/EventEmitter';  

const AddHotelScreen = ({ navigation }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        setUserRole(role);
      } catch (error) {
        console.error('Error getting user role:', error);
      }
    };
    getUserRole();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    price: '',
    mainPhoto: null,
    galleryPhotos: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const pickImage = async (isMainPhoto = true) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        if (isMainPhoto) {
          setFormData(prev => ({ ...prev, mainPhoto: { uri } }));
        } else {
          setFormData(prev => ({
            ...prev,
            galleryPhotos: [...prev.galleryPhotos, { uri }]
          }));
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.latitude) newErrors.latitude = 'Latitude is required';
    if (!formData.longitude) newErrors.longitude = 'Longitude is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.mainPhoto) newErrors.mainPhoto = 'Main photo is required';

    if (isNaN(parseFloat(formData.latitude))) {
      newErrors.latitude = 'Latitude must be a valid number';
    }
    if (isNaN(parseFloat(formData.longitude))) {
      newErrors.longitude = 'Longitude must be a valid number';
    }
    if (isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Price must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
    
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }


      const hotelData = new FormData();
      

      hotelData.append('name', formData.name);
      hotelData.append('description', formData.description);
      hotelData.append('address', formData.address);
      hotelData.append('latitude', formData.latitude.toString());
      hotelData.append('longitude', formData.longitude.toString());
      hotelData.append('price', formData.price.toString());

     
      if (formData.mainPhoto) {
        const mainPhotoName = formData.mainPhoto.uri.split('/').pop();
        hotelData.append('mainPhoto', {
          uri: formData.mainPhoto.uri,
          name: mainPhotoName,
          type: 'image/jpeg',
        });
      }

      
      if (formData.galleryPhotos.length > 0) {
        formData.galleryPhotos.forEach((photo) => {
          const photoName = photo.uri.split('/').pop();
          hotelData.append('galleryPhotos', {
            uri: photo.uri,
            name: photoName,
            type: 'image/jpeg',
          });
        });
      }


      const response = await axios.post('/api/user/hotels', hotelData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        transformRequest: (data) => {
          return data;
        },
      });

      console.log('Hotel creation response:', response.data);

      
      EventEmitter.emit('hotelAdded', response.data);

      Alert.alert(
        'Success',
        'Hotel added successfully',
        [{ 
          text: 'OK', 
          onPress: () => {
            navigation.goBack();
            navigation.navigate('Dashboard', {
              screen: 'MyHotels',
              params: { refresh: Date.now() }
            });
          }
        }]
      );
    } catch (error) {
      console.error('Error adding hotel:', error);
      
      let errorMessage = 'Failed to add hotel';
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        
        navigation.replace('SignIn');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add New Hotel</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Hotel Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
            placeholder="Enter hotel name"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
            placeholder="Enter hotel description"
            multiline
            numberOfLines={4}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, errors.address && styles.inputError]}
            value={formData.address}
            onChangeText={(text) => setFormData({...formData, address: text})}
            placeholder="Enter hotel address"
          />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={styles.label}>Latitude</Text>
            <TextInput
              style={[styles.input, errors.latitude && styles.inputError]}
              value={formData.latitude}
              onChangeText={(text) => setFormData({...formData, latitude: text})}
              placeholder="Enter latitude"
              keyboardType="numeric"
            />
            {errors.latitude && <Text style={styles.errorText}>{errors.latitude}</Text>}
          </View>

          <View style={[styles.formGroup, styles.flex1, styles.marginLeft]}>
            <Text style={styles.label}>Longitude</Text>
            <TextInput
              style={[styles.input, errors.longitude && styles.inputError]}
              value={formData.longitude}
              onChangeText={(text) => setFormData({...formData, longitude: text})}
              placeholder="Enter longitude"
              keyboardType="numeric"
            />
            {errors.longitude && <Text style={styles.errorText}>{errors.longitude}</Text>}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Price per Night</Text>
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            value={formData.price}
            onChangeText={(text) => setFormData({...formData, price: text})}
            placeholder="Enter price"
            keyboardType="numeric"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Main Photo</Text>
          <TouchableOpacity 
            style={styles.imageUpload}
            onPress={() => pickImage(true)}
          >
            {formData.mainPhoto ? (
              <Image
                source={{ uri: formData.mainPhoto.uri }}
                style={styles.previewImage}
              />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <MaterialIcons name="add-photo-alternate" size={40} color="#95a5a6" />
                <Text style={styles.uploadText}>Upload Main Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {errors.mainPhoto && <Text style={styles.errorText}>{errors.mainPhoto}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Gallery Photos</Text>
          <ScrollView 
            horizontal 
            style={styles.galleryContainer}
            showsHorizontalScrollIndicator={false}
          >
            {formData.galleryPhotos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo.uri }}
                style={styles.galleryImage}
              />
            ))}
            <TouchableOpacity 
              style={styles.addGalleryPhoto}
              onPress={() => pickImage(false)}
            >
              <MaterialIcons name="add" size={30} color="#95a5a6" />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Adding Hotel...' : 'Add Hotel'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: 10,
  },
  imageUpload: {
    height: 200,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  uploadText: {
    color: '#95a5a6',
    fontSize: 16,
    marginTop: 10,
  },
  galleryContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  addGalleryPhoto: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddHotelScreen;