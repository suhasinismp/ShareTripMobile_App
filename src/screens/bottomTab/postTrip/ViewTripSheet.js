import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Platform, Dimensions } from 'react-native';
import AppHeader from '../../../components/AppHeader';
import { fetchTripSheetByPostId, generateTripPdf } from '../../../services/postTripService';
import { useSelector } from 'react-redux';
import { getTripDetailsSelector, getUserDataSelector } from '../../../store/selectors';
import CustomButton from '../../../components/ui/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { cleanHTML } from '../../../utils/cleanHTML';
const { width } = Dimensions.get('window');
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ViewTripSheet = ({ route }) => {
  const { postId, from } = route.params;

  const navigation = useNavigation();

  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;
  const tripDetails = useSelector(getTripDetailsSelector);



  const [pdfUri, setPdfUri] = useState(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);


  useEffect(() => {
    fetchTripSheetByPostId(postId, userToken)
    // .then((response) => {
    //   if (!response.error && response.data) {
    //     setTripDetails(response.data);
    //   }
    // })
    // .catch((error) => {
    //   console.error('Error', error);
    // });

  }, [postId, userToken]);

  const getTripData = () => {

    if (!tripDetails) {
      return [];
    }

    const data = [
      { label: 'Booking Type', value: tripDetails[0].bookingType_name },
      { label: 'Package', value: tripDetails[0].bookingTypePackage_name },
      { label: 'Vehicle Type', value: tripDetails[0].Vehicle_type_name },
      { label: 'Vehicle name', value: tripDetails[0].Vehicle_name },
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


  const handleGeneratePDF = async () => {
    setIsPdfGenerating(true);
    try {

      const finalData = { post_booking_id: postId };

      const response = await generateTripPdf(finalData, userToken);
      const cleanedHtml = cleanHTML(response);

      const { uri } = await Print.printToFileAsync({
        html: cleanedHtml,
        base64: false,
      });

      const filename = `tripsheet_${Date.now()}.pdf`;
      const destinationUri = `${Platform.OS === 'android' ? FileSystem.cacheDirectory : FileSystem.documentDirectory}${filename}`;

      await FileSystem.copyAsync({
        from: uri,
        to: destinationUri,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(destinationUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save PDF',
        });
        setPdfUri(destinationUri);
      } else {
        alert('Sharing is not available on this device');
      }

      await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsPdfGenerating(false);
    }
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
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', padding: 16 }}>
          {from == 'bills' && (
            <CustomButton
              title={isPdfGenerating ? 'Generating PDF...' : 'Share PDF'}
              style={[
                styles.submitButton,

                isPdfGenerating && styles.disabledButton,
              ]}
              onPress={handleGeneratePDF}
              disabled={isPdfGenerating}
            />
          )}
          {from !== 'home' && (
            <CustomButton
              title={'Edit'}
              style={{ width: 150, alignSelf: 'flex-end', }}
              onPress={() => {
                navigation.navigate('PostTrip', {
                  from: from,
                  postId: postId,
                });
              }}
            />
          )}

        </View>
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
  submitButton: {
    width: width * 0.45,
    alignItems: 'center',
    backgroundColor: '#008B8B',
    borderRadius: 8,
    paddingVertical: 14,
  },
});

export default ViewTripSheet;
