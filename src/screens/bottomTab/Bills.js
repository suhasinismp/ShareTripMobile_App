// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import AppHeader from '../../components/AppHeader';
// import CustomSelect from '../../components/ui/CustomSelect';
// import PostCard from '../../components/PostCard';
// import CustomAccordion from '../../components/ui/CustomAccordion';
// import { getMyDutiesBill, getMyPostedTripBills } from '../../services/billService';
// import { useSelector } from 'react-redux';
// import { getUserDataSelector } from '../../store/selectors';

// const Bills = () => {
//   const userData = useSelector(getUserDataSelector);
//   const userId = userData.userId;
//   const userToken = userData.userToken;

//   const [selectedFilterOne, setSelectedFilterOne] = useState('myDuties');
//   const [selectedFilterTwo, setSelectedFilterTwo] = useState('PostedTrips');
//   const [MyDutiesBill, setMyDutiesBill] = useState([])
//   const [postedTripBills, setPostedTripBills] = useState([])

//   useEffect(() => {
//     fetchMyDutiesBill(),
//       fetchPostedTripsBills()
//   }, [MyDutiesBill, postedTripBills])


//   const fetchMyDutiesBill = async () => {
//     try {
//       const response = await getMyDutiesBill(userId, userToken)
//       console.log('xyz', response)
//       if (response?.error === false) {
//         setMyDutiesBill(response?.data);
//       }
//     } catch (error) {
//       console.error('error fetching myDuties bills', error)
//     }
//   }

//   const fetchPostedTripsBills = async () => {
//     try {
//       const response = await getMyPostedTripBills(userId, userToken)
//       if (response?.error === false) {
//         setPostedTripBills(response.data);
//       }
//     } catch (error) {
//       console.error('error fetching PostedTrip bills', error)
//     }
//   }

//   const renderItem = ({ item }) => {
//     if (
//       selectedFilterOne === 'myDuties' &&
//       selectedFilterTwo === 'PostedTrips'
//     ) {
//       return (
//         <CustomAccordion
//           bookingType={item?.booking_type_name}
//           // amount={item?.base_fare_rate}
//           pickUpTime={item?.pick_up_time}
//           fromDate={item?.trip_date}
//           distanceTime={item?.distance_time}
//           vehicleType={item?.vehicle_type}
//           vehicleName={item?.vehicle_name}
//           pickUpLocation={item?.pick_up_location}
//           destination={item?.destination}
//           postComments={item?.post_comments}
//           postVoiceMessage={item?.post_voice_message}
//           drivers={item?.trackingDetails}
//           // onCallPress={() => { }}
//           // onMessagePress={() => { }}
//           // onRefreshData={fetchUiData}
//           userToken={userToken}
//         />
//       );
//     }

//     return (
//       <PostCard
//         bookingType={item?.booking_type_name}
//         userProfilePic={
//           item?.user_profile_pic || 'https://via.placeholder.com/150'
//         }
//         userName={item?.user_name}
//         pickUpTime={item?.pick_up_time}
//         fromDate={item?.from_date}
//         vehicleType={item?.vehicle_type}
//         vehicleName={item?.vehicle_name}
//         pickUpLocation={item?.pick_up_location}
//         destination={item?.destination}
//         postComments={item?.post_comments}
//         postVoiceMessage={item?.post_voice_message}
//         // baseFareRate={item?.booking_tarif_base_fare_rate}
//         // onRequestPress={() => handleButtonPress(item)}
//         // onCallPress={() => handleCall(item?.user_phone)}
//         // onPlayPress={() => { }}
//         // onMessagePress={() => { }}
//         isRequested={item?.post_trip_trip_status || item?.request_status}
//         packageName={item?.booking_package_name}
//       />
//     );
//   };



//   return (
//     <>
//       <AppHeader
//         drawerIcon={true}
//         groupIcon={true}
//         onlineIcon={true}
//         muteIcon={true}
//         search={true}
//       />
//       <View style={styles.container}>
//         <View style={styles.filterRoww}>
//           <CustomSelect
//             text="My Duties"
//             isSelected={selectedFilterOne === 'MyDuties'}
//             onPress={() => setSelectedFilterOne('MyDuties')}
//           />
//           <CustomSelect
//             text="Posted Trips"
//             isSelected={selectedFilterOne === 'PostedTrips'}
//             onPress={() => setSelectedFilterOne('PostedTrips')}
//           />
//         </View>
//         <View style={styles.filterRow}>
//           <CustomSelect
//             text="Local"
//             isSelected={selectedFilterTwo === 'Local'}
//             onPress={() => setSelectedFilterTwo('Local')}
//           />
//           <CustomSelect
//             text="Out Station"
//             isSelected={selectedFilterTwo === 'OutStation'}
//             onPress={() => setSelectedFilterTwo('OutStation')}
//           />
//           <CustomSelect
//             text="Transfer"
//             isSelected={selectedFilterTwo === 'Transfer'}
//             onPress={() => setSelectedFilterTwo('Transfer')}
//           />
//         </View>
//       </View>

//     </>
//   );
// };

// const styles = StyleSheet.create({
//   filterRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     margin: 20,
//   },
//   filterRoww: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 80,
//     margin: 10,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#F0F0F0',
//   },
// });

// export default Bills;


import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import AppHeader from '../../components/AppHeader';
import CustomSelect from '../../components/ui/CustomSelect';
import PostCard from '../../components/PostCard';
import CustomAccordion from '../../components/ui/CustomAccordion';
import { getMyDutiesBill, getMyPostedTripBills } from '../../services/billService';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';

const Bills = () => {
  const userData = useSelector(getUserDataSelector);
  const userId = userData.userId;
  const userToken = userData.userToken;

  const [selectedFilterOne, setSelectedFilterOne] = useState('myDuties');
  const [selectedFilterTwo, setSelectedFilterTwo] = useState('PostedTrips');
  const [MyDutiesBill, setMyDutiesBill] = useState([]);
  const [postedTripBills, setPostedTripBills] = useState([]);

  useEffect(() => {
    fetchMyDutiesBill();
    fetchPostedTripsBills();
  }, []); // Empty dependency array ensures it runs only once.

  const fetchMyDutiesBill = async () => {
    try {
      const response = await getMyDutiesBill(userId, userToken);
      if (response?.error === false) {
        setMyDutiesBill(response?.data || []);
      }
    } catch (error) {
      console.error('Error fetching My Duties bills:', error);
    }
  };

  const fetchPostedTripsBills = async () => {
    try {
      const response = await getMyPostedTripBills(userId, userToken);
      if (response?.error === false) {
        setPostedTripBills(response?.data || []);
      }
    } catch (error) {
      console.error('Error fetching Posted Trips bills:', error);
    }
  };

  const renderItem = ({ item }) => {
    if (selectedFilterOne === 'myDuties') {
      return (
        <CustomAccordion
          bookingType={item?.booking_type_name}
          pickUpTime={item?.pick_up_time}
          fromDate={item?.trip_date}
          distanceTime={item?.distance_time}
          vehicleType={item?.vehicle_type}
          vehicleName={item?.vehicle_name}
          pickUpLocation={item?.pick_up_location}
          destination={item?.destination}
          postComments={item?.post_comments}
          postVoiceMessage={item?.post_voice_message}
          drivers={item?.trackingDetails}
          userToken={userToken}
        />
      );
    }

    return (
      <PostCard
        bookingType={item?.booking_type_name}
        userProfilePic={item?.user_profile_pic || 'https://via.placeholder.com/150'}
        userName={item?.user_name}
        pickUpTime={item?.pick_up_time}
        fromDate={item?.from_date}
        vehicleType={item?.vehicle_type}
        vehicleName={item?.vehicle_name}
        pickUpLocation={item?.pick_up_location}
        destination={item?.destination}
        postComments={item?.post_comments}
        postVoiceMessage={item?.post_voice_message}
        isRequested={item?.post_trip_trip_status || item?.request_status}
        packageName={item?.booking_package_name}
      />
    );
  };

  const dataSource =
    selectedFilterOne === 'myDuties' ? MyDutiesBill : postedTripBills;

  return (
    <>
      <AppHeader
        drawerIcon={true}
        groupIcon={true}
        onlineIcon={true}
        muteIcon={true}
        search={true}
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
        </View>
        <View style={styles.filterRow}>
          <CustomSelect
            text="Local"
            isSelected={selectedFilterOne === 'myDuties' || 'PostedTrips'}
            // isSelected={selectedFilterTwo === 'Local'}
            onPress={() => setSelectedFilterTwo('Local')}
          />
          <CustomSelect
            text="Out Station"
            isSelected={selectedFilterOne === 'myDuties' || 'PostedTrips'}
            // isSelected={selectedFilterTwo === 'OutStation'}
            onPress={() => setSelectedFilterTwo('OutStation')}
          />
          <CustomSelect
            text="Transfer"
            isSelected={selectedFilterOne === 'myDuties' || 'PostedTrips'}
            // isSelected={selectedFilterTwo === 'Transfer'}
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
