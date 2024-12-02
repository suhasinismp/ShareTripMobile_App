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
import { generateTripPdf } from '../../../services/postTripService';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDataSelector } from '../../../store/selectors';
import { showSnackbar } from '../../../store/slices/snackBarSlice';

const INITIAL_DATA = [
  {
    title: '',
    data: [
      {
        type: 'header',
        totalPayable: 2500,
        advance: 500,
        totalAmount: 3000,
      },
    ],
  },
  {
    title: 'Fare Breakdown',
    data: [
      { label: 'Booking Type', value: 'Out Station' },
      { label: 'Slab rate', value: '800' },
      { label: 'Slab kms', value: '30kms' },
      { label: 'Extra Kms Charges', value: '15kms*13 = 195rs' },
      { label: 'Drivers Batta', value: '400' },
    ],
  },
  {
    title: 'Others Charges',
    data: [
      { label: 'Parking', value: '200' },
      { label: 'Tolls', value: '170' },
      { label: 'Other State Taxes', value: '600' },
      { label: 'Advance', value: '500' },
      { label: 'Cleaning Charges', value: '' },
    ],
  },
  {
    title: 'Customer Detail',
    data: [{ label: 'Manu', value: '987653210' }],
  },
  {
    title: 'Driver Detail',
    data: [
      {
        type: 'driver',
        name: 'Ramu Nayak',
        phone: '9876543210',
        vehicle: 'Toyota SUV',
        number: 'KA05 ED 6411',
      },
    ],
  },
  {
    title: 'Trip Usage',
    data: [
      { label: 'Trip Usage', value: '45kms' },
      { label: 'Pickup Place', value: 'Rajajai Nagar' },
      { label: 'Visiting Places', value: 'Place 1' },
    ],
  },
];

const cleanHTML = (response) => {
  try {
    if (!response) {
      return '<html><body><p>No content available</p></body></html>';
    }

    const htmlContent = response.html || response;

    if (typeof htmlContent !== 'string') {
      return '<html><body><p>Invalid content format</p></body></html>';
    }

    return htmlContent
      .replace(/\\n/g, '\n')
      .replace(/\\/g, '')
      .replace(/" "/g, '"')
      .replace(/class=\s*"\s*([^"]+)\s*"/g, 'class="$1"')
      .replace(/\s+/g, ' ')
      .replace(/style=\s*"\s*([^"]+)\s*"/g, 'style="$1"')
      .replace(/<!--\s*-->/g, '')
      .replace(/>\s+</g, '><')
      .trim();
  } catch (error) {
    console.error('Error cleaning HTML:', error);
    return '<html><body><p>Error processing content</p></body></html>';
  }
};

const TripBillScreen = ({ route }) => {
  const dispatch = useDispatch();
  const [pdfUri, setPdfUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [tripData, setTripData] = useState(INITIAL_DATA);
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
      // Replace this with your actual API call
      // const response = await getTripDetails(postId, userToken);
      // const formattedData = formatTripData(response);
      // setTripData(formattedData);
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
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        await generateAndSavePDF();
      } else {
        dispatch(
          showSnackbar({
            visible: true,
            message: 'Storage permission denied',
            type: 'error',
          }),
        );
      }
    } catch (error) {
      console.error('Permission error:', error);
      dispatch(
        showSnackbar({
          visible: true,
          message: 'Failed to get storage permission',
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
      const response = await generateTripPdf(finalData, userToken);

      const cleanedHtml = cleanHTML(response);

      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html: cleanedHtml,
        base64: false,
      });

      // For Android, save to Downloads folder
      if (Platform.OS === 'android') {
        try {
          // First try the Downloads directory
          const downloadDir = `${FileSystem.documentDirectory}Download/`;
          await FileSystem.makeDirectoryAsync(downloadDir, {
            intermediates: true,
          });

          const filename = `tripsheet_${Date.now()}.pdf`;
          const destinationUri = `${downloadDir}${filename}`;

          await FileSystem.copyAsync({
            from: uri,
            to: destinationUri,
          });

          // Try to make it visible in gallery/files app
          try {
            await MediaLibrary.requestPermissionsAsync();
            await MediaLibrary.createAssetAsync(destinationUri);
          } catch (mediaError) {
            console.log(
              'Media library registration failed, file still saved:',
              mediaError,
            );
          }

          setPdfUri(destinationUri);
          dispatch(
            showSnackbar({
              visible: true,
              message: 'PDF saved to Downloads folder',
              type: 'success',
            }),
          );
        } catch (downloadError) {
          // Fallback to app's document directory if Downloads fails

          const appDir = FileSystem.documentDirectory;
          const filename = `tripsheet_${Date.now()}.pdf`;
          const fallbackUri = `${appDir}${filename}`;

          await FileSystem.copyAsync({
            from: uri,
            to: fallbackUri,
          });

          setPdfUri(fallbackUri);
          dispatch(
            showSnackbar({
              visible: true,
              message: 'PDF saved to app storage',
              type: 'success',
            }),
          );
        }
      } else {
        // iOS handling
        const downloadDir = `${FileSystem.documentDirectory}Downloads/`;
        await FileSystem.makeDirectoryAsync(downloadDir, {
          intermediates: true,
        });

        const filename = `tripsheet_${Date.now()}.pdf`;
        const destinationUri = `${downloadDir}${filename}`;

        await FileSystem.copyAsync({
          from: uri,
          to: destinationUri,
        });

        setPdfUri(destinationUri);
        dispatch(
          showSnackbar({
            visible: true,
            message: 'PDF saved successfully',
            type: 'success',
          }),
        );
      }

      // Delete the temporary file
      try {
        await FileSystem.deleteAsync(uri);
      } catch (deleteError) {
        console.log('Error deleting temporary file:', deleteError);
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
    <View style={styles.container}>
      <SectionList
        sections={tripData}
        keyExtractor={(item, index) => item.label + index}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) =>
          title ? <Text style={styles.sectionHeader}>{title}</Text> : null
        }
        stickySectionHeadersEnabled={false}
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
            <Text style={styles.buttonText}>Download PDF</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: '#fff',
    padding: 15,
    color: '#34495e',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
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
