


import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import {
  getMyDutiesBill,
  getMyPostedTripBills,
  getMySelfTripBills,
} from '../../../services/billService';
import { getMyDutiesBillsSelector, getPostedBillsSelector, getSelfTripBillsSelector, getUserDataSelector } from '../../../store/selectors';
import AppHeader from '../../../components/AppHeader';
import CustomSelect from '../../../components/ui/CustomSelect';
import PostCard from '../../../components/PostCard';
import { useNavigation } from '@react-navigation/native';

const Bills = () => {
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const MyDutiesBill = useSelector(getMyDutiesBillsSelector);

  const postedTripBills = useSelector(getPostedBillsSelector);
  const selfTripBills = useSelector(getSelfTripBillsSelector)
  const userId = userData.userId;
  const userToken = userData.userToken;


  const [selectedFilterOne, setSelectedFilterOne] = useState('myDuties');
  const [isSelfTrip, setIsSelfTrip] = useState(false)
  console.log({ isSelfTrip });

  const [selectedFilterTwo, setSelectedFilterTwo] = useState('PostedTrips');
  const [dataSource, setDataSource] = useState([]);


  useEffect(() => {
    if (selectedFilterOne === 'myDuties') {
      setDataSource(MyDutiesBill)
    } else if (selectedFilterOne === 'PostedTrips') {
      setDataSource(postedTripBills)
    } else {
      setDataSource(selfTripBills)

    }
  }, [selectedFilterOne,])

  useEffect(() => {
    if (selectedFilterOne === 'SelfTrips') {
      setIsSelfTrip(true)
    } else { setIsSelfTrip(false) }

  }, [selectedFilterOne])



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
  }
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
        bookingType={item?.booking_type_name || item?.postBooking?.bookingType?.booking_type_name}
        userProfilePic={
          item?.user_profile_pic || item?.postBooking?.User?.u_profile_pic
        }
        userName={item?.user_name || item?.postBooking?.User?.u_name}
        pickUpTime={item?.pick_up_time}
        fromDate={item?.from_date}
        vehicleType={item?.vehicle_type || item?.postBooking?.VehicleTypes?.v_type}
        vehicleName={item?.vehicle_name || item?.postBooking?.VehicleNames?.v_name}
        pickUpLocation={item?.pick_up_location}
        destination={item?.destination}
        postComments={item?.post_comments || item?.postBooking?.post_comments}
        postVoiceMessage={item?.post_voice_message || item?.postBooking?.post_voice_message}
        packageName={item?.booking_package_name || item?.postBooking?.bookingTypeTariff?.[0]?.bookingTypePackage?.package_name}
        viewTripSheet={true}
        viewTripSheetOnPress={() => {
          navigation.navigate('ViewTripSheet', {
            from: 'bills',
            isSelfTrip: isSelfTrip,
            postId: item?.post_booking_id || item?.post_bookings_id
          });
        }}
        driverTripBill={true}
        driverTripBillOnPress={() => {

          navigation.navigate('TripBill', { postId: item?.post_booking_id || item?.post_bookings_id, });
        }}
        customerBill={true}
        customerBillOnPress={() => {
          navigation.navigate('TripBill', { postId: item?.post_booking_id || item?.post_bookings_id, });
        }}
        billsScreen={true}

      />
    );
  };




  return (
    <>
      <AppHeader
        drawerIcon={true}
        groupIcon={true}
        onlineIcon={true}
        muteIcon={true}
        search={true}
      />
      <Text
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 20,
          marginBottom: 10,
        }}
      >
        Bills
      </Text>
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
        </View>
        <View style={styles.filterRow}>
          <CustomSelect
            text="Local"
            isSelected={selectedFilterOne === 'myDuties' || 'PostedTrips'}
            onPress={() => setSelectedFilterTwo('Local')}
          />
          <CustomSelect
            text="Out Station"
            isSelected={selectedFilterOne === 'myDuties' || 'PostedTrips'}
            onPress={() => setSelectedFilterTwo('OutStation')}
          />
          <CustomSelect
            text="Transfer"
            isSelected={selectedFilterOne === 'myDuties' || 'PostedTrips'}
            onPress={() => setSelectedFilterTwo('Transfer')}
          />
        </View>
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
    margin: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 10,
  },
  list: {
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});

export default Bills;
