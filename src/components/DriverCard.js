import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../styles/fonts';

const DriverCard = ({
  name,
  phone,
  profileImage,
  vehicleType,
  vehicleName,
  vehicleNumber,
  amount,
  onAccept,
  onReject,
  onCall,
  postId,
}) => {
  // console.log('postId', postId);
  return (
    <View style={styles.container}>
      {/* Driver Info Section */}
      <View style={styles.driverSection}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: profileImage || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.driverName}>{name}</Text>
            <Text style={styles.phoneNumber}>{phone}</Text>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleText}>
                Vehicle: {`${vehicleType} ${vehicleName}`}
              </Text>
              <Text style={styles.vehicleNumber}>{vehicleNumber}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.actionsSection}>
        <Text style={styles.amountText}>Amount: Rs.{amount}/-</Text>
        <TouchableOpacity style={styles.callButton} onPress={onCall}>
          <Ionicons name="call-outline" size={24} color="#005680" />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={onReject}
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={onAccept}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileImage: {
    width: 34,
    height: 34,
    borderRadius: 16,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold600,
    color: '#000000',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 14,
    fontFamily: FONTS.Regular400,
    color: '#666666',
    marginBottom: 4,
  },
  vehicleInfo: {
    gap: 2,
  },
  vehicleText: {
    fontSize: 14,
    fontFamily: FONTS.Regular400,
    color: '#666666',
  },
  vehicleNumber: {
    fontSize: 14,
    fontFamily: FONTS.Regular400,
    color: '#666666',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  amountText: {
    fontSize: 14,
    fontFamily: FONTS.Regular400,
    color: '#000000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  rejectButton: {
    backgroundColor: '#D33D0E',
  },
  acceptButton: {
    backgroundColor: '#005680',
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FONTS.Medium500,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FONTS.Medium500,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DriverCard;
