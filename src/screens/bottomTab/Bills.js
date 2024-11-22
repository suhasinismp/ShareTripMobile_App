import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import CustomSelect from '../../components/ui/CustomSelect';
import PostCard from '../../components/PostCard';

const Bills = () => {

  const [selectedFilterOne, setSelectedFilterOne] = useState('myDuties');
  const [selectedFilterTwo, setSelectedFilterTwo] = useState('PostedTrips');
  const [item, setItem] = useState([]);

  {
    item && (

      <PostCard
        bookingType={item?.booking_type_name}
        userProfilePic={
          item?.user_profile_pic || 'https://via.placeholder.com/150'
        }
        userName={item?.user_name}
        pickUpTime={item?.pick_up_time}
        fromDate={item?.from_date}
        vehicleType={item?.vehicle_type}
        vehicleName={item?.vehicle_name}
        pickUpLocation={item?.pick_up_location}
        destination={item?.destination}
        postComments={item?.post_comments}
        postVoiceMessage={item?.post_voice_message}
        baseFareRate={item?.booking_tarif_base_fare_rate}
        onRequestPress={() => handleButtonPress(item)}
        onCallPress={() => handleCall(item?.user_phone)}
        onPlayPress={() => { }}
        onMessagePress={() => { }}
        isRequested={item?.post_trip_trip_status || item?.request_status}
        packageName={item?.booking_package_name}
      />

    )
  }



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
        <View style={styles.filterRoww}>
          <CustomSelect
            text="My Duties"
            isSelected={selectedFilterOne === 'MyDuties'}
            onPress={() => setSelectedFilterOne('MyDuties')}
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
  filterRoww: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 80,
    margin: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
});

export default Bills;
