import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HotelCard from '../../components/HotelCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import SearchBar from '../../components/SearchBar';
import axios from '../../services/axios';
import EventEmitter from '../../utils/EventEmitter';

const hasRole = (userRole, roleToCheck) => {
  if (!userRole) return false;
  const roles = userRole.split(' ');
  return roles.includes(roleToCheck);
};

const DashboardScreen = ({ navigation, route }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
   
    const unsubscribe = EventEmitter.on('hotelDeleted', (deletedHotelId) => {
      setHotels(currentHotels => 
        currentHotels.filter(hotel => hotel.id !== deletedHotelId)
      );
    });

    fetchUserHotels();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    
    const addSubscription = EventEmitter.on('hotelAdded', (newHotel) => {
      setHotels(currentHotels => [...currentHotels, newHotel]);
    });

  
    const updateSubscription = EventEmitter.on('hotelUpdated', (updatedHotel) => {
      setHotels(currentHotels => 
        currentHotels.map(hotel => 
          hotel.id === updatedHotel.id ? updatedHotel : hotel
        )
      );
    });

    const focusSubscription = navigation.addListener('focus', () => {
      if (route.params?.refresh) {
        fetchUserHotels();
        navigation.setParams({ refresh: undefined });
      }
    });

    fetchUserHotels();

    return () => {
      addSubscription();
      updateSubscription();
      focusSubscription();
    };
  }, [navigation, route.params]);

  useEffect(() => {
    getUserRole();
    fetchUserHotels();
  }, []);

  const getUserRole = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    } catch (error) {
      console.error('Error getting user role:', error);
    }
  };

  const fetchUserHotels = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/hotels');
      setHotels(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch hotels');
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Hotels</Text>
        <SearchBar
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search hotels..."
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddHotel')}
      >
        <MaterialIcons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add New Hotel</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredHotels}
        renderItem={({ item }) => (
          <HotelCard
            hotel={item}
            onPress={() => navigation.navigate('EditHotel', { hotel: item })}
            onView={() => navigation.navigate('HotelDetail', { hotel: item })}
            onEdit={() => navigation.navigate('EditHotel', { hotel: item })}
            onDelete={hasRole(userRole, 'ADMIN') ? () => handleDeleteHotel(item) : null}
            showActions
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchUserHotels}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  list: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  modalText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DashboardScreen;