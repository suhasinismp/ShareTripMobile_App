import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../../styles/fonts';
import DotDivider from '../../../assets/svgs/dotDivider.svg';
import DriverCard from '../DriverCard';
import {
  acceptDriverRequest,
  rejectDriverRequest,
} from '../../services/MyTripsService';
import { useDispatch, useSelector } from 'react-redux';
import { showSnackbar } from '../../store/slices/snackBarSlice';
import { getUserDataSelector } from '../../store/selectors';
import CustomModal from './CustomModal';
import BillMeBillDriverModal from '../tripModals/BillMeBillDriverModal';

const CustomAccordion = ({
  bookingType,
  amount,
  pickUpTime,
  fromDate,
  distanceTime,
  vehicleType,
  vehicleName,
  pickUpLocation,
  destination,
  onDelete,
  drivers = [],
  onRefreshData,
  userToken,
  postId,
}) => {
  console.log('CustomAccordion postId', postId);

  console.log('Drivers array in CustomAccordion:', {
    driversLength: drivers.length,
    driversData: drivers
  });

  const dispatch = useDispatch();

  const userData = useSelector(getUserDataSelector);
  const loggedInUserId = userData.userId;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBillMeBillDriverModal, setShowBillMeBillDriverModal] =
    useState(false);
  const [billToDriver, setBillToDriver] = useState(true);
  const [billToMe, setBillToMe] = useState(false);
  const [driverDetails, setDriverDetails] = useState({});
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedRotate = useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    const toValue = isExpanded ? 0 : 1;

    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedRotate, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setIsExpanded(!isExpanded);
  };

  const rotateArrow = animatedRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400],
  });

  const handleCancel = () => {
    setShowBillMeBillDriverModal(false);
  };

  const handleAcceptDriver = async (driver) => {
    console.log('handleAcceptDriver', driver);
    setDriverDetails(driver);
    setShowBillMeBillDriverModal(true);
  };
  const handleContinue = async (driver) => {
    console.log('handleContinue', driver);
    try {
      let finalData = {
        post_booking_id: postId,
        accepted_user_id: driverDetails?.user_id,
        vehicle_id: driverDetails?.vehicle_id,
        post_chat: 'SOME CHATS HERE',
        final_bill_by_poster: true,
        posted_user_id: loggedInUserId,
        bill_access: billToMe ? false : true,
      };
      console.log("finalData", finalData)
      const response = await acceptDriverRequest(finalData, userToken);
      console.log("response", response)
      if (response?.status === 'Start Trip') {
        setShowBillMeBillDriverModal(false);
        dispatch(
          showSnackbar({
            visible: true,
            message: `Trip has been assigned to ${driver?.user_name}.`,
            type: 'success',
          }),
        );

        // Refresh the data after successful acceptance
        await onRefreshData();
      }
    } catch (error) {
      console.error('Error accepting driver:', error);
      dispatch(
        showSnackbar({
          visible: true,
          message: 'Failed to accept driver request',
          type: 'error',
        }),
      );
    }
  };

  const handleRejectDriver = async (driver) => {
    try {
      let finalData = {
        post_bookings_id: driver?.post_id,
        accepted_user_id: driver?.user_id,
      };

      const response = await rejectDriverRequest(finalData, userToken);

      if (response?.message === 'Post Trip request rejected successfully') {
        dispatch(
          showSnackbar({
            visible: true,
            message: `${driver?.user_name} request is rejected`,
            type: 'success',
          }),
        );

        // Refresh the data after successful rejection
        await onRefreshData();
      }
    } catch (error) {
      console.error('Error rejecting driver:', error);
      dispatch(
        showSnackbar({
          visible: true,
          message: 'Failed to reject driver request',
          type: 'error',
        }),
      );
    }
  };

  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.bookingType}>{bookingType}</Text>
          <Text style={styles.amount}>Amount: {amount}</Text>
        </View>

        {isExpanded && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color="#D33D0E" />
          </TouchableOpacity>
        )}
      </View>
      <DotDivider />

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Time Row */}
        <View style={styles.infoRow}>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={20} color="#005680" />
            <Text style={styles.timeText}>{pickUpTime}</Text>
            <Text style={styles.dateText}>{fromDate}</Text>
          </View>
          <View style={styles.distanceVehicleContainer}>
            <View style={styles.distanceContainer}>
              <Ionicons name="car-outline" size={20} color="#005680" />
              <Text style={styles.distanceText}>{distanceTime}</Text>
            </View>
            <View style={styles.vehicleContainer}>
              <Ionicons name="car" size={20} color="#005680" />
              <Text style={styles.vehicleText}>
                {`${vehicleType}, ${vehicleName}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Location Info */}
        <View style={styles.locationContainer}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={20} color="#4CAF50" />
            <Text style={styles.locationText}>{pickUpLocation}</Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={20} color="#F44336" />
            <Text style={styles.locationText}>{destination}</Text>
          </View>
        </View>

        {/* Toggle Button */}
        <TouchableOpacity style={styles.toggleButton} onPress={toggleAccordion}>
          <Animated.View
            style={[
              styles.arrowContainer,
              { transform: [{ rotate: rotateArrow }] },
            ]}
          >
            <Ionicons name="chevron-down" size={14} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Expandable Content for Drivers */}
      <Animated.View style={[styles.expandableContent, { maxHeight }]}>
        {drivers.map((driver, index) => (
          <View key={index} style={styles.driverCard}>
            <DriverCard
              name={driver.user_name}
              phone={driver.user_phone}
              vehicleName={driver.vehicle_name}
              vehicleType={driver.vehicle_type}
              vehicleId={driver.vehicle_id}
              postId={postId}
              vehicleNumber={driver.vehicle_registration_number}
              profileImage={
                driver.user_profile || 'https://via.placeholder.com/150'
              }
              amount={amount}
              onAccept={() => handleAcceptDriver(driver)}
              onReject={() => handleRejectDriver(driver)}
              onCall={() => { }}
            />
          </View>

        ))}
      </Animated.View>
      <CustomModal
        visible={showBillMeBillDriverModal}
        onSecondaryAction={() => setShowBillMeBillDriverModal(false)}
      >
        <BillMeBillDriverModal
          BillToMe={billToMe}
          BillToDriver={billToDriver}
          SetBillToMe={setBillToMe}
          SetBillToDriver={setBillToDriver}
          handleContinue={handleContinue}
          handleCancel={handleCancel}
          onClose={() => setShowBillMeBillDriverModal(false)}
        />
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingType: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold600,
    color: '#123F67',
  },
  amount: {
    fontSize: 14,
    fontFamily: FONTS.Regular400,
    color: '#666',
  },
  mainContent: {
    padding: 16,
    paddingTop: 8,
  },
  infoRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distanceVehicleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vehicleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    fontFamily: FONTS.Regular400,
    color: '#171661',
  },
  dateText: {
    fontSize: 14,
    fontFamily: FONTS.Regular400,
    color: '#171661',
    marginLeft: 8,
  },
  distanceText: {
    fontSize: 14,
    fontFamily: FONTS.Regular400,
    color: '#171661',
  },
  vehicleText: {
    fontSize: 14,
    fontFamily: FONTS.Regular400,
    color: '#171661',
  },
  locationContainer: {
    gap: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    fontFamily: FONTS.Regular400,
    color: '#0F0F0F',
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  toggleButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 24,
    height: 24,
    backgroundColor: '#005680',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowContainer: {
    width: 24,
    height: 24,
    borderRadius: 20,
    backgroundColor: '#005680',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandableContent: {
    overflow: 'hidden',
  },
  driverCard: {
    backgroundColor: '#FFFFFF',
    margin: 8,
    borderRadius: 8,
    padding: 16,
  },
});

export default CustomAccordion;
