import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { generateTripPdf } from '../../../services/postTripService';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDataSelector } from '../../../store/selectors';
import { showSnackbar } from '../../../store/slices/snackBarSlice';

const cleanHTML = (response) => {
  try {
    // Add null check and provide default HTML
    if (!response) {
      console.log('Response is null, using default HTML');
      return '<html><body><p>No content available</p></body></html>';
    }

    // Check if response is HTML string or has HTML property
    const htmlContent = response.html || response;

    if (typeof htmlContent !== 'string') {
      console.log('Invalid HTML content type:', typeof htmlContent);
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
  const postId = route.params.postId;
  const dispatch = useDispatch();
  const [pdfUri, setPdfUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userData = useSelector(getUserDataSelector);
  const userToken = userData?.userToken;

  useEffect(() => {
    (async () => {
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
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (pdfUri) {
      dispatch(
        showSnackbar({
          visible: true,
          message: `PDF saved successfully at: ${pdfUri}`,
          type: 'success',
        }),
      );
    }
  }, [pdfUri, dispatch]);

  const generateAndSavePDF = async () => {
    try {
      // Log the beginning of PDF generation
      console.log('Starting PDF generation...');

      const finalData = { post_booking_id: postId };
      const response = await generateTripPdf(finalData, userToken);

      // Log the response for debugging
      console.log('API Response:', response);

      const cleanedHtml = cleanHTML(response);
      console.log('Cleaned HTML length:', cleanedHtml.length);

      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html: cleanedHtml,
        base64: false,
      });

      console.log('PDF generated at temporary location:', uri);

      // Define the download directory based on platform
      const downloadDir = Platform.select({
        ios: `${FileSystem.documentDirectory}Downloads/`,
        android: FileSystem.documentDirectory,
      });

      // Create downloads directory if it doesn't exist
      await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });

      // Generate a unique filename with timestamp
      const filename = `tripsheet_${Date.now()}.pdf`;
      const destinationUri = `${downloadDir}${filename}`;

      // Copy the file to downloads directory
      await FileSystem.copyAsync({
        from: uri,
        to: destinationUri,
      });

      console.log('PDF copied to destination:', destinationUri);

      try {
        // Save to device's media library
        const asset = await MediaLibrary.createAssetAsync(destinationUri);
        console.log('Asset created:', asset);

        // For Android, you can find the file in the Downloads folder
        if (Platform.OS === 'android') {
          console.log(
            'Android file location:',
            `Internal Storage/Downloads/${filename}`,
          );
        } else {
          console.log('iOS file location:', destinationUri);
        }

        setPdfUri(destinationUri);
      } catch (mediaError) {
        console.error('Media library error:', mediaError);
        // Even if media library fails, we still have the file in app directory
        setPdfUri(destinationUri);
        dispatch(
          showSnackbar({
            visible: true,
            message: 'PDF saved in app directory',
            type: 'warning',
          }),
        );
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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{isLoading ? 'Generating PDF...' : 'TripBillScreen'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default TripBillScreen;
