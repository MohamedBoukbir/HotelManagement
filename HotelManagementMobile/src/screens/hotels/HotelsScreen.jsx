import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ImageViewer from '../../components/ImageViewer';
import axios from '../../services/axios';
import EventEmitter from '../../utils/EventEmitter';
import AsyncStorage from '@react-native-async-storage/async-storage';


const hasRole = (userRole, roleToCheck) => {
  if (!userRole) return false;
  const roles = userRole.split(' ');
  return roles.includes(roleToCheck);
};

const HotelsScreen = ({ navigation }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const unsubscribe = EventEmitter.on('hotelDeleted', (deletedHotelId) => {
      setHotels(currentHotels => 
        currentHotels.filter(hotel => hotel.id !== deletedHotelId)
      );
    });

    const updateSubscription = EventEmitter.on('hotelUpdated', (updatedHotel) => {
      setHotels(currentHotels => 
        currentHotels.map(hotel => 
          hotel.id === updatedHotel.id ? updatedHotel : hotel
        )
      );
    });

    fetchHotels();

    return () => {
      unsubscribe();
      updateSubscription();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHotels(); 
    });

    return unsubscribe;
  }, [navigation]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/hotels');
      setHotels(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = (hotel) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${hotel.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`/api/admin/hotels/${hotel.id}`);
              setHotels((prevHotels) =>
                prevHotels.filter((item) => item.id !== hotel.id)
              );
            
              EventEmitter.emit('hotelDeleted', hotel.id);
              Alert.alert('Success', 'Hotel deleted successfully');
            } catch (err) {
              console.error('Error deleting hotel:', err);
              Alert.alert('Error', 'Failed to delete hotel');
            }
          },
        },
      ]
    );
  };

  const renderHotelItem = ({ item: hotel }) => (
    <View style={styles.hotelCard}>
      <View style={styles.imageContainer}>
        <ImageViewer
          imageName={hotel.mainPhoto}
          style={styles.mainImage}
          resizeMode="cover"
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>${hotel.price}</Text>
          <Text style={styles.priceSubtext}>/night</Text>
        </View>
      </View>

      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{hotel.name}</Text>
        <View style={styles.addressContainer}>
          <MaterialIcons name="location-on" size={16} color="#95a5a6" />
          <Text style={styles.hotelAddress}>{hotel.address}</Text>
        </View>
        <Text style={styles.hotelDescription} numberOfLines={2}>
          {hotel.description}
        </Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => navigation.navigate('HotelDetail', { hotel })}
          >
            <MaterialIcons name="visibility" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>

        
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => navigation.navigate('EditHotel', { hotel })}
            >
              <MaterialIcons name="edit" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
       
          {hasRole(userRole, 'ADMIN') && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteHotel(hotel)}
            >
              <MaterialIcons name="delete" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={hotels}
        renderItem={renderHotelItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  hotelCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  hotelInfo: {
    padding: 16,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hotelAddress: {
    color: '#95a5a6',
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  hotelDescription: {
    color: '#7f8c8d',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  priceTag: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: 'rgba(52, 152, 219, 0.95)',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  priceText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  priceSubtext: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  viewButton: {
    backgroundColor: '#3498db',
  },
  editButton: {
    backgroundColor: '#28a745', 
  },
  deleteButton: {
    backgroundColor: '#dc3545', 
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default HotelsScreen;