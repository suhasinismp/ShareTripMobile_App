import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { generateBillPdf } from '../../../services/postTripService';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDataSelector } from '../../../store/selectors';
import { showSnackbar } from '../../../store/slices/snackBarSlice';
import AppHeader from '../../../components/AppHeader';
import { cleanHTML } from '../../../utils/cleanHTML';
import { fetchTripBill } from '../../../services/tripBillService';
import { useNavigation } from '@react-navigation/native';

function formatTripData(responseData) {
  const data = responseData;

  const extraKmsCharge = `${data.extra_kms}kms*${data.bookingTypeTariff_extra_km_rate} = ${data.extra_km_amount}rs`;

  return [
    {
      title: '',
      data: [
        {
          type: 'header',
          totalPayable: data.total_amount,
          advance: data.total_amount - data.balance_amount,
          totalAmount: data.balance_amount,
        },
      ],
    },
    {
      title: 'Fare Breakdown',
      data: [
        { label: 'Booking Type', value: data.bookingType_name },
        {
          label: 'Slab rate',
          value: data.bookingTypeTariff_base_fare_rate.toString(),
        },
        { label: 'Slab kms', value: `${data.packageKms}kms` },
        { label: 'Extra Kms Charges', value: extraKmsCharge },
        {
          label: 'Day Batta',
          value: data.day_batta_count || 0,
        },
        {
          label: 'Night Batta',
          value: data.night_batta_count || 0,
        },
      ],
    },
    {
      title: 'Others Charges',
      data: [
        { label: 'Parking', value: data.parking || 0 },
        { label: 'Tolls', value: data.tolls || 0 },
        { label: 'Other State Taxes', value: data.state_tax || 0 },
        {
          label: 'Advance',
          value: data.total_amount - data.balance_amount || 0,
        },
        { label: 'Cleaning Charges', value: data.cleaning || 0 },
      ],
    },
    {
      title: 'Customer Details',
      data: [
        {
          label: data.customer_name,
          value: data.customer_phone_no,
        },
      ],
    },
    {
      title: 'Driver & Vehicle Details',
      data: [
        {
          type: 'driver',
          name: data.driver_name,
          phone: data.driver_phone,
          vehicle: data.Vehicle_type_name,
          number: data.vehicle_registration_number,
        },
      ],
    },
    {
      title: 'Trip Usage',
      data: [
        {
          label: 'Trip Usage',
          value: `${data.extra_kms + data.packageKms}kms`,
        },
        {
          label: 'Pickup Place',
          value: data.pick_up_location,
        },
        {
          label: 'Visiting Places',
          value: data.visiting_place,
        },
      ],
    },
  ];
}

const TripBillScreen = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [pdfUri, setPdfUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [tripData, setTripData] = useState([]);

  const userData = useSelector(getUserDataSelector);
  const userToken = userData?.userToken;
  const postId = route.params?.postId;

  useEffect(() => {
    if (postId) {
      loadTripData();
    }
  }, [postId]);

  const loadTripData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchTripBill(postId, userToken);

      const formattedData = formatTripData(response?.data);

      setTripData(formattedData);
    } catch (error) {
      console.error('Error loading trip data:', error);
      dispatch(
        showSnackbar({
          visible: true,
          message: 'Failed to load trip details',
          type: 'error',
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsPdfGenerating(true);
    try {
      await generateAndSavePDF();
    } catch (error) {
      console.error('Error generating PDF:', error);
      dispatch(
        showSnackbar({
          visible: true,
          message: 'Failed to generate PDF',
          type: 'error',
        }),
      );
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const generateAndSavePDF = async () => {
    try {
      const finalData = { post_booking_id: postId };
      const response = await generateBillPdf(finalData, userToken);
      const cleanedHtml = cleanHTML(response);

      const { uri } = await Print.printToFileAsync({
        html: cleanedHtml,
        base64: false,
      });

      if (Platform.OS === 'android') {
        try {
          const filename = `tripsheet_${Date.now()}.pdf`;
          const destinationUri = `${FileSystem.cacheDirectory}${filename}`;

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
            dispatch(
              showSnackbar({
                visible: true,
                message: 'PDF ready to be saved',
                type: 'success',
              }),
            );
          } else {
            dispatch(
              showSnackbar({
                visible: true,
                message: 'Sharing is not available on this device',
                type: 'error',
              }),
            );
          }
        } catch (shareError) {
          console.error('Share error:', shareError);
          dispatch(
            showSnackbar({
              visible: true,
              message: 'Error sharing PDF. Please try again.',
              type: 'error',
            }),
          );
        }
      } else {
        const filename = `tripsheet_${Date.now()}.pdf`;
        const destinationUri = `${FileSystem.documentDirectory}${filename}`;

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
        }

        setPdfUri(destinationUri);
      }

      // Cleanup: Delete the temporary file
      try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      } catch (deleteError) {
        console.error('Error deleting temporary file:', deleteError);
      }
    } catch (error) {
      console.error('Error in PDF generation process:', error);
      dispatch(
        showSnackbar({
          visible: true,
          message: 'Error generating PDF. Please try again.',
          type: 'error',
        }),
      );
    }
  };

  const renderHeader = ({ item }) => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Total Amount Payable</Text>
      <Text style={styles.headerAmount}>Rs {item.totalPayable}</Text>
      <View style={styles.headerDetailsRow}>
        <View>
          <Text style={styles.headerLabel}>Advance</Text>
          <Text style={styles.headerValue}>Rs {item.advance}</Text>
        </View>
        <View>
          <Text style={styles.headerLabel}>Total Amount</Text>
          <Text style={styles.headerValue}>Rs {item.totalAmount}</Text>
        </View>
      </View>
    </View>
  );

  const renderDriverDetail = ({ item }) => (
    <View style={styles.driverContainer}>
      <View style={styles.driverDetail}>
        <Text style={styles.driverName}>{item.name}</Text>
        <Text style={styles.driverPhone}>{item.phone}</Text>
      </View>
      <View style={styles.vehicleDetail}>
        <Text style={styles.vehicleType}>{item.vehicle}</Text>
        <Text style={styles.vehicleNumber}>{item.number}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item, section }) => {
    if (item.type === 'header') return renderHeader({ item });
    if (item.type === 'driver') return renderDriverDetail({ item });

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemLabel}>{item.label}</Text>
        <Text style={styles.itemValue}>{item.value}</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2980b9" />
        <Text style={styles.loadingText}>Loading trip details...</Text>
      </View>
    );
  }

  return (
    <>
      <AppHeader title={'Trip Bill'} backIcon={true} />
      <View style={styles.container}>
        <SectionList
          sections={tripData}
          keyExtractor={(item, index) => item.label + index}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) =>
            title ? <Text style={styles.sectionHeader}>{title}</Text> : null
          }
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isPdfGenerating && styles.buttonDisabled]}
            onPress={handleDownloadPDF}
            disabled={isPdfGenerating}
          >
            {isPdfGenerating ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={[styles.buttonText, styles.buttonTextMargin]}>
                  Generating PDF...
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Share PDF</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, isPdfGenerating && styles.buttonDisabled]}
            onPress={() => navigation.navigate('TripBillEdit', { postId })}
            disabled={isPdfGenerating}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  headerContainer: {
    backgroundColor: '#e6f3ff',
    padding: 20,
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 10,
  },
  headerAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  headerDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerLabel: {
    fontSize: 16,
    color: '#2c3e50',
  },
  headerValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    padding: 15,
    color: '#34495e',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLabel: {
    fontSize: 16,
    color: '#2c3e50',
  },
  itemValue: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  driverContainer: {
    padding: 15,
  },
  driverDetail: {
    marginBottom: 10,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  driverPhone: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  vehicleDetail: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  vehicleType: {
    fontSize: 16,
    color: '#2c3e50',
  },
  vehicleNumber: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  buttonContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#2980b9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonTextMargin: {
    marginLeft: 10,
  },
});

export default TripBillScreen;
