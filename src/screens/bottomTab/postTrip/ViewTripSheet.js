import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Platform, Dimensions } from 'react-native';
import AppHeader from '../../../components/AppHeader';
import { fetchTripSheetByPostId, generateSelfTripPdf, generateTripPdf } from '../../../services/postTripService';
import { useSelector } from 'react-redux';
import { getTripDetailsSelector, getUserDataSelector } from '../../../store/selectors';
import CustomButton from '../../../components/ui/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { cleanHTML } from '../../../utils/cleanHTML';
const { width } = Dimensions.get('window');
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

function formatTime(isoString) {
  const date = new Date(isoString); // Convert the ISO string to a Date object
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12 || 12; // Converts 0 hours to 12
  const formattedMinutes = minutes.toString().padStart(2, "00");
  // console.log('ppp', formattedMinutes)
  return `${hours}:${formattedMinutes} ${ampm}`;
}


const ViewTripSheet = ({ route }) => {
  const { postId, from, isSelfTrip } = route.params;
  console.log({ isSelfTrip })

  const navigation = useNavigation();

  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;
  const tripDetails = useSelector(getTripDetailsSelector);



  const [pdfUri, setPdfUri] = useState(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);


  useEffect(() => {

    fetchTripSheetByPostId(postId, userToken)

  }, [postId, userToken]);

  const getTripData = () => {

    if (!tripDetails) {
      return [];
    }

    const tripData = tripDetails[0].tripSheetFinal[0].tripSheetRide
    console.log({ tripData })
    const lengthOfData = tripData.length
    let totalHours = 0;
    let totalMinutes = 0;
    let totalKms = 0;

    tripData.forEach((trip) => {
      // Extract hours and minutes
      const match = trip.total_hours.match(/(\d+)h:(\d+)m/);
      if (match) {
        totalHours += parseInt(match[1], 10);
        totalMinutes += parseInt(match[2], 10);
      }

      // Add total kilometers
      totalKms += parseInt(trip.total_kms, 10);
    });

    // Convert excess minutes to hours
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    const totalTripHrs = `${totalHours}h:${totalMinutes}m`;
    const totalTripKms = `${totalKms} kms`;

    const timeString = formatTime("2025-02-20T07:05:00Z");
    console.log(timeString);

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
      { label: 'Pick Up Time', value: formatTime(tripDetails[0].pick_up_time) || '-' },
      { label: 'Payment Type', value: tripDetails[0].payment_type || '-' },
      { label: 'Note', value: tripDetails[0].note_1 || '-' },
    ];


    if (from === 'bills') {
      data.push(
        { label: 'Start kms', value: tripDetails[0].tripSheetFinal?.[0].tripSheetRide?.[0].start_kms || '-' },
        { label: 'End Kms', value: tripDetails[0].tripSheetFinal?.[0].tripSheetRide?.[lengthOfData - 1].end_kms || '-' },
        { label: 'Total kms', value: totalTripKms || '-' },
        { label: 'Total Hrs', value: totalTripHrs || '-' }
      )
    }

    if (from != 'home') {
      data.unshift(
        { label: 'Customer Name', value: tripDetails[0].customer_name || '-' },
        {
          label: 'Customer Phone', value: tripDetails[0]?.customer_phone_no || '-',
        },
      );
    }

    return data;
  };



  const handleGeneratePDF = async (selfTrip) => {
    setIsPdfGenerating(true);
    try {
      const finalData = { post_booking_id: postId };

      let response;
      if (isSelfTrip === true) {
        // Call selfTrip API
        response = await generateSelfTripPdf(finalData, userToken); // replace with actual self-trip API function
      } else {
        // Call the original generateTripPdf API
        response = await generateTripPdf(finalData, userToken);
      }

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
