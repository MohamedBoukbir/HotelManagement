import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const HotelDetailScreen = ({ route, navigation }) => {
  const { hotel } = route.params;

  const openMaps = () => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${hotel.latitude},${hotel.longitude}`;
    const label = hotel.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>

      <Image
        source={{ uri: `http://192.168.1.128:8085/api/uploads/${hotel.mainPhoto}` }}
        style={styles.mainImage}
      />

      <View style={styles.content}>
 
        <Text style={styles.title}>{hotel.name}</Text>

    
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${hotel.price}</Text>
          <Text style={styles.night}> / night</Text>
        </View>

    
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={20} color="#e74c3c" />
          <Text style={styles.location}>{hotel.address}</Text>
        </View>

 
        <Text style={styles.description}>{hotel.description}</Text>

  
        <Text style={styles.sectionTitle}>Gallery</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.gallery}
        >
          {hotel.galleryPhotos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: `http://192.168.1.128:8085/api/uploads/${photo}` }}
              style={styles.galleryImage}
            />
          ))}
        </ScrollView>

  
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: hotel.latitude,
              longitude: hotel.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: hotel.latitude,
                longitude: hotel.longitude,
              }}
              title={hotel.name}
              description={hotel.address}
            />
          </MapView>

      
          <TouchableOpacity style={styles.openMapButton} onPress={openMaps}>
            <MaterialIcons name="directions" size={20} color="#fff" />
            <Text style={styles.openMapButtonText}>Open in Maps</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
  night: {
    fontSize: 16,
    color: '#95a5a6',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  location: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 5,
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  gallery: {
    marginBottom: 20,
  },
  galleryImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  mapContainer: {
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  openMapButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  openMapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default HotelDetailScreen;