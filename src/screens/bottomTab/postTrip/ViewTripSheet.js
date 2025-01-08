import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import AppHeader from '../../../components/AppHeader';
import { fetchTripSheetByPostId } from '../../../services/postTripService';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../../store/selectors';
import CustomButton from '../../../components/ui/CustomButton';
import { useNavigation } from '@react-navigation/native';

const ViewTripSheet = ({ route }) => {
  const { postId, from } = route.params;
  const navigation = useNavigation();

  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;
  const [tripDetails, setTripDetails] = useState(null);
  console.log({ tripDetails });

  useEffect(() => {
    fetchTripSheetByPostId(postId, userToken)
      .then((response) => {
        if (!response.error && response.data) {
          setTripDetails(response.data);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  }, [postId, userToken]);

  const getTripData = () => {
    if (!tripDetails) {
      return [];
    }

    const data = [
      { label: 'Booking Type', value: tripDetails[0].bookingType_name },
      { label: 'Package', value: tripDetails[0].bookingTypePackage_name },
      { label: 'Vehicle Type', value: tripDetails[0].Vehicle_type_name },
      { label: 'Vehicle', value: tripDetails[0].Vehicle_name },
      { label: 'Trip Starts On', value: tripDetails[0].from_date },
      { label: 'Trip Ends On', value: tripDetails[0].to_date },
      {
        label: 'Pick Up Location',
        value: tripDetails[0].pick_up_location || '-',
      },
      { label: 'Destination', value: tripDetails[0].destination || '-' },
      { label: 'Visiting Places', value: tripDetails[0].visiting_place || '-' },
      { label: 'From Date', value: tripDetails[0].from_date || '-' },
      { label: 'To Date', value: tripDetails[0].to_date || '-' },
      { label: 'Pick Up Time', value: tripDetails[0].pick_up_time || '-' },
      { label: 'Payment Type', value: tripDetails[0].payment_type || '-' },
      { label: 'Note', value: tripDetails[0].note_1 || '-' },
    ];

    if (from != 'home') {
      data.unshift(
        { label: 'Customer Name', value: tripDetails[0].customer_name || '-' },
        {
          label: 'Customer Phone',
          value: tripDetails[0].customer_phone_no || '-',
        },
      );
    }

    return data;
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.value}>{item.value}</Text>
    </View>
  );

  return (
    <>
      <AppHeader title="Trip Sheet" backIcon={true} />
      <View style={styles.container}>
        <FlatList
          data={getTripData()}
          renderItem={renderItem}
          keyExtractor={(item) => item.label}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Loading trip details...</Text>
            </View>
          }
        />
        {from !== 'home' && (
          <CustomButton
            title={'Edit'}
            style={{ marginTop: 20, width: 150, alignSelf: 'flex-end' }}
            onPress={() => {
              navigation.navigate('PostTrip', {
                from: 'home',
                postId: postId,
              });
            }}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#113F67',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#113F67',
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#113F67',
    textAlign: 'center',
  },
});

export default ViewTripSheet;
