import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ImageViewer from './ImageViewer';

const HotelCard = ({ hotel, onPress, onView, onEdit, onDelete, showActions }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.imageContainer}>
          <ImageViewer 
            imageName={hotel.mainPhoto}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>${hotel.price}</Text>
            <Text style={styles.priceSubtext}>/night</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{hotel.name}</Text>
          <View style={styles.addressContainer}>
            <MaterialIcons name="location-on" size={16} color="#95a5a6" />
            <Text style={styles.address} numberOfLines={1}>
              {hotel.address}
            </Text>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {hotel.description}
          </Text>
        </View>
      </TouchableOpacity>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.viewButton]} 
            onPress={onView}
          >
            <MaterialIcons name="visibility" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={onEdit}
          >
            <MaterialIcons name="edit" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>

          {onDelete && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={onDelete}
            >
              <MaterialIcons name="delete" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
  image: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: 'rgba(52, 152, 219, 0.95)',
    padding: 8,
    borderRadius: 8,
  },
  priceText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  priceSubtext: {
    color: '#fff',
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  name: {
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
  address: {
    color: '#95a5a6',
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  description: {
    color: '#7f8c8d',
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: '#3498db',
  },
  editButton: {
    backgroundColor: '#2ecc71',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
});

export default HotelCard;