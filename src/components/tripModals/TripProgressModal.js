import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const TripProgressModal = ({
  handleContinueForNextDay,
  handleEndTrip,
  onClose,
  transfer
}) => {
  console.log('transfer', transfer)
  return (
    <View style={styles.modalContent}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 10, right: 10 }}
        onPress={onClose}
      >
        <FontAwesome name="times" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.modalTitle}>Trip Status</Text>
      <Text style={styles.tripStatus}>Your Trip is in Progress</Text>
      {transfer ? null : (<TouchableOpacity
        style={[styles.actionButton]}
        onPress={handleContinueForNextDay}
      >
        <Text style={styles.actionButtonText}>Continue for Next Day</Text>
      </TouchableOpacity>)}


      <TouchableOpacity style={styles.actionButton} onPress={handleEndTrip}>
        <Text style={styles.actionButtonText}>End Trip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  tripStatus: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#1e4976',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  disabledButton: {
    backgroundColor: 'grey',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default TripProgressModal;
