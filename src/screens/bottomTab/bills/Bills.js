import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import {
  getMyDutiesBill,
  getMyPostedTripBills,
  getMySelfTripBills,
} from '../../../services/billService';
import {
  getMyDutiesBillsSelector,
  getPostedBillsSelector,
  getSelfTripBillsSelector,
  getUserDataSelector,
} from '../../../store/selectors';
import AppHeader from '../../../components/AppHeader';
import CustomSelect from '../../../components/ui/CustomSelect';
import PostCard from '../../../components/PostCard';
import FilterIcon from '../../../../assets/svgs/filter.svg';
import { useNavigation } from '@react-navigation/native';
import { handleCall } from '../HomeScreen';


const Bills = () => {
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const MyDutiesBill = useSelector(getMyDutiesBillsSelector);

  const postedTripBills = useSelector(getPostedBillsSelector);
  const selfTripBills = useSelector(getSelfTripBillsSelector);
  const userId = userData.userId;
  const userToken = userData.userToken;

  const [selectedFilterOne, setSelectedFilterOne] = useState('myDuties');
  const [selectedFilterTwo, setSelectedFilterTwo] = useState('Local');
  const [showLocationFilters, setShowLocationFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [isSelfTrip, setIsSelfTrip] = useState(false);
  // const [showFilters, setShowFilters] = useState(false);

  // const [selectedFilterTwo, setSelectedFilterTwo] = useState('PostedTrips');
  // const [dataSource, setDataSource] = useState([]);



  // Add this useEffect to filter data based on booking type
  // useEffect(() => {
  //   let filteredData = [];

  //   if (selectedFilterOne === 'myDuties') {
  //     filteredData = MyDutiesBill;
  //   } else if (selectedFilterOne === 'PostedTrips') {
  //     filteredData = postedTripBills;
  //   } else {
  //     filteredData = selfTripBills;
  //   }

  //   // Filter based on booking type
  //   if (selectedFilterTwo === 'Local' || selectedFilterTwo === 'OutStation' || selectedFilterTwo === 'Transfer') {
  //     filteredData = filteredData.filter(item =>
  //       (item?.booking_type_name || item?.postBooking?.bookingType?.booking_type_name) === selectedFilterTwo
  //     );
  //   }

  //   setDataSource(filteredData);
  // }, [selectedFilterOne, selectedFilterTwo, MyDutiesBill, postedTripBills, selfTripBills]);

  useEffect(() => {
    let filteredData = [];

    // Add null checks and ensure arrays
    if (selectedFilterOne === 'myDuties') {
      filteredData = MyDutiesBill || [];
    } else if (selectedFilterOne === 'PostedTrips') {
      filteredData = postedTripBills || [];
    } else {
      filteredData = selfTripBills || [];
    }

    // Filter based on booking type with improved outstation handling
    // if (selectedFilterTwo && filteredData.length > 0) {
    //   filteredData = filteredData.filter(item => {
    //     if (!item) return false;  // Skip null/undefined items

    if (showLocationFilters && selectedFilterTwo && filteredData.length > 0) {
      filteredData = filteredData.filter(item => {
        if (!item) return false;

        const bookingType = (
          item?.booking_type_name ||
          item?.postBooking?.bookingType?.booking_type_name ||
          ''
        ).toLowerCase();

        const selectedType = selectedFilterTwo.toLowerCase();

        // Special handling for OutStation
        if (selectedType === 'outstation') {
          return ['outstation', 'out station', 'outstation trip'].includes(bookingType);
        }
        // For Local and Transfer
        return bookingType === selectedType.toLowerCase();
      });
    }
    setDataSource(filteredData);
  }, [
    selectedFilterOne,
    selectedFilterTwo,
    showLocationFilters,
    MyDutiesBill,
    postedTripBills,
    selfTripBills
  ]);


  const fetchMyDutiesBill = async () => {
    try {
      const response = await getMyDutiesBill(userId, userToken);
    } catch (error) {
      console.error('Error fetching My Duties bills:', error);
    }
  };

  const fetchPostedTripsBills = async () => {
    try {
      const response = await getMyPostedTripBills(userId, userToken);
    } catch (error) {
      console.error('Error fetching Posted Trips bills:', error);
    }
  };

  const fetchSelfTripBills = async () => {
    try {
      const response = await getMySelfTripBills(userId, userToken);
      

    } catch (error) {
      console.error('Error fetching Self Trip bills:', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchMyDutiesBill();
      fetchPostedTripsBills();
      fetchSelfTripBills();
    }, []),
  );

  const renderItem = ({ item }) => {

    return (
      <PostCard
        bookingType={
          item?.booking_type_name ||
          item?.postBooking?.bookingType?.booking_type_name
        }
        userProfilePic={
          item?.user_profile_pic || item?.postBooking?.User?.u_profile_pic
        }
        userName={item?.user_name || item?.postBooking?.User?.u_name}
        pickUpTime={item?.pick_up_time || item?.postBooking?.pick_up_time}
        fromDate={item?.from_date || item?.postBooking?.from_date}
        vehicleType={
          item?.vehicle_type || item?.postBooking?.VehicleTypes?.v_type
        }
        vehicleName={
          item?.vehicle_name || item?.postBooking?.VehicleNames?.v_name
        }
        pickUpLocation={item?.pick_up_location || item?.postBooking?.pick_up_location}
        destination={item?.destination}
        postComments={item?.post_comments || item?.postBooking?.post_comments}
        postVoiceMessage={
          item?.post_voice_message || item?.postBooking?.post_voice_message
        }
        packageName={
          item?.booking_package_name ||
          item?.postBooking?.bookingTypeTariff?.[0]?.bookingTypePackage
            ?.package_name
        }
        onCallPress={() => handleCall(item?.user_phone || item?.postBooking?.User?.u_phone)}

        viewTripSheet={true}
        viewTripSheetOnPress={() => {
          navigation.navigate('ViewBillsTripSheet', {
            from: 'bills',
            isSelfTrip: selectedFilterOne === 'SelfTrips',
            postId: item?.post_booking_id || item?.post_bookings_id,
          });
        }}

        isAvailable={true}
        postStatus={'Available'}  // Changed to 'Available'
        requestStatus={'Request'}  // Add this
        onRequestPress={() => { }}  // Add this
        isRequested={false}  // Add this
        vacantTripPostedByLoggedInUser={undefined}
        showActionButtons={true}


        driverTripBill={true}
        driverTripBillOnPress={() => {
          navigation.navigate('TripBill', {
            postId: item?.post_booking_id || item?.post_bookings_id,
            from: 'bills',
            type: selectedFilterOne
          });
        }}

        customerBill={true}
        customerBillOnPress={() => {
          navigation.navigate('TripBill', {
            postId: item?.post_booking_id || item?.post_bookings_id,
            from: 'bills',
            type: selectedFilterOne
          });
        }}
        billsScreen={true}
      />
    );
  };

  return (
    <>
      <AppHeader
        title="TripSheet/Bills"
        backIcon={true}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <View style={styles.filterRow}>
          <CustomSelect
            text="My Duties"
            isSelected={selectedFilterOne === 'myDuties'}
            onPress={() => setSelectedFilterOne('myDuties')}
          />
          <CustomSelect
            text="Posted Trips"
            isSelected={selectedFilterOne === 'PostedTrips'}
            onPress={() => setSelectedFilterOne('PostedTrips')}
          />
          <CustomSelect
            text="Self Trips"
            isSelected={selectedFilterOne === 'SelfTrips'}
            onPress={() => setSelectedFilterOne('SelfTrips')}
          />
          <TouchableOpacity
            onPress={() => setShowLocationFilters(!showLocationFilters)}
            style={styles.filterIconContainer}
          >
            <FilterIcon />
          </TouchableOpacity>
        </View>

        {showLocationFilters && (
          <View style={styles.filterRow}>
            <CustomSelect
              text="Local"
              isSelected={selectedFilterTwo === 'Local'}
              onPress={() => setSelectedFilterTwo('Local')}
            />
            <CustomSelect
              text="Out Station"
              isSelected={selectedFilterTwo === 'OutStation'}
              onPress={() => setSelectedFilterTwo('OutStation')}
            />
            <CustomSelect
              text="Transfer"
              isSelected={selectedFilterTwo === 'Transfer'}
              onPress={() => setSelectedFilterTwo('Transfer')}
            />
          </View>
        )}

        <FlatList
          data={dataSource}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No data available</Text>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    // padding: 10,
  },
  list: {
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  filterIconContainer: {
    padding: 5,
  }
});

export default Bills;
