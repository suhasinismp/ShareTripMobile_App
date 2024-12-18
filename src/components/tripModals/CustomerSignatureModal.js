import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import * as FileSystem from 'expo-file-system';
import { uploadSignature } from '../../services/myTripsService';
import { useNavigation } from '@react-navigation/native';

const CustomerSignatureModal = ({
  selectedTripData,
  userToken,
  userId,
  onClose,
  fetch,
}) => {
  const navigation = useNavigation()
  const [signatureFileInfo, setSignatureFileInfo] = useState(null);
  const signatureRef = useRef();

  const handleSignature = async (signature) => {
    try {
      if (!signature) return;

      const path = FileSystem.cacheDirectory + 'sign.png';
      const base64Data = signature.split(',')[1];

      if (!base64Data) return;

      await FileSystem.writeAsStringAsync(path, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileInfo = await FileSystem.getInfoAsync(path);

      if (fileInfo.exists) {
        setSignatureFileInfo(fileInfo);
      }
    } catch (error) {
      console.error('Error saving signature:', error);
    }
  };

  const handleEndTrip = async () => {
    try {
      if (!signatureFileInfo) {
        console.log('No signature captured');
        return;
      }

      const finalData = {
        post_bookings_id: selectedTripData?.post_booking_id,
        accepted_user_id: userId,
        posted_user_id: selectedTripData?.posted_user_id,
      };

      let formData = new FormData();
      formData.append('json', JSON.stringify(finalData));
      formData.append('signature', {
        uri: signatureFileInfo.uri,
        type: 'image/png',
        name: 'customer_signature.png',
      });

      console.log('FormData contents:', {
        json: formData.getParts().find((part) => part.fieldName === 'json')
          ?.string,
        signature: formData
          .getParts()
          .find((part) => part.fieldName === 'signature'),
      });

      const response = await uploadSignature(formData, userToken);
      console.log('Signature upload response:', response);

      if (response?.error === false) {
        onClose();
        // await fetch();
        navigation.navigate('Bills')
      }
    } catch (error) {
      console.error('Error uploading signature:', error);
    }
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
      setSignatureFileInfo(null);
    }
  };

  const style = `.m-signature-pad { box-shadow: none; border: none; } 
    .m-signature-pad--body { border: none; }
    .m-signature-pad--footer { display: none; margin: 0px; }
    .m-signature-pad--body canvas {
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      background-color: #FFFFFF;
    }`;

  return (
    <View style={styles.signatureModalContainer}>
      <View style={styles.signatureHeaderContainer}>
        <Text style={styles.signatureTitle}>Customer Signature</Text>

        <Text style={styles.signatureWarningText}>
          Note: Check your valuables, we are not Responsible for your Belongings
        </Text>

        <View style={styles.signatureDetailsContainer}>
          <View style={styles.signatureDetailRow}>
            <Text style={styles.signatureLabel}>Booking Id</Text>
            <Text style={styles.signatureValue}>
              : {selectedTripData?.post_booking_id || 'N/A'}
            </Text>
          </View>

          <View style={styles.signatureDetailRow}>
            <Text style={styles.signatureLabel}>Customer Name</Text>
            <Text style={styles.signatureValue}>
              : {selectedTripData?.user_name || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.signaturePadContainer}>
        <SignatureScreen
          ref={signatureRef}
          onOK={handleSignature}
          onEmpty={() => setSignatureFileInfo(null)}
          webStyle={style}
          autoClear={false}
          imageType="image/png"
          trimWhitespace={true}
          dotSize={1}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (signatureRef.current && !signatureFileInfo) {
                signatureRef.current.readSignature();
              } else {
                handleEndTrip();
              }
            }}
          >
            <Text style={styles.actionButtonText}>End Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signatureModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 600,
    padding: 20,
  },
  signatureHeaderContainer: {
    marginBottom: 24,
  },
  signatureTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  signatureWarningText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
  signatureDetailsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
  },
  signatureDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  signatureLabel: {
    fontSize: 16,
    color: '#333',
    width: 140,
  },
  signatureValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  preview: {
    height: 180,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  signatureImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  previewText: {
    fontSize: 16,
    color: '#666',
  },
  signaturePadContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
  },
  buttonContainer: {
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#1e4976',
    padding: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CustomerSignatureModal;
