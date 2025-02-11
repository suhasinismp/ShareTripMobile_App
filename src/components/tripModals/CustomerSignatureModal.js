import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import * as FileSystem from 'expo-file-system';
import {
  postAdditionCharges,
  uploadSignature,
} from '../../services/MyTripsService';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const CustomerSignatureModal = ({
  selectedTripData,
  userToken,
  userId,
  onClose,
  fetch,
  goTo,
  additionalCharges,
}) => {
  console.log({ additionalCharges })
  const navigation = useNavigation();
  const [signatureFileInfo, setSignatureFileInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const signatureRef = useRef();

  // const handleSignature = async (signature) => {
  //   try {
  //     if (!signature) return;

  //     setIsProcessing(true);

  //     const path = FileSystem.cacheDirectory + 'sign.png';
  //     const base64Data = signature.split(',')[1];

  //     if (!base64Data) {
  //       setIsProcessing(false);
  //       return;
  //     }

  //     await FileSystem.writeAsStringAsync(path, base64Data, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     const fileInfo = await FileSystem.getInfoAsync(path);

  //     if (fileInfo.exists) {
  //       setSignatureFileInfo(fileInfo);
  //       // Once we have the file info, proceed with the upload
  //       await handleEndTrip(fileInfo);
  //     }
  //   } catch (error) {
  //     console.error('Error saving signature:', error);
  //     setIsProcessing(false);
  //   }
  // };


  const handleSignature = async (signature) => {
    try {
      if (!signature) return;

      setIsProcessing(true);

      const path = FileSystem.cacheDirectory + "sign.png";
      const base64Data = signature.split(",")[1];

      if (!base64Data) {
        setTimeout(() => {
          setIsProcessing(false);
        }, 3000);
        return;
      }

      await FileSystem.writeAsStringAsync(path, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileInfo = await FileSystem.getInfoAsync(path);

      if (fileInfo.exists) {
        setSignatureFileInfo(fileInfo);
        // Once we have the file info, proceed with the upload
        await handleEndTrip(fileInfo);
      }
    } catch (error) {
      console.error("Error saving signature:", error);
      setTimeout(() => {
        setIsProcessing(false);
      }, 3000);
    }
  };

  const handleEndTrip = async (fileInfo) => {
    console.log('entered')
    try {
      if (!fileInfo) {
        console.log('No signature file info available');
        return;
      }
      if (additionalCharges?.additionalChargesData) {
        console.log('hi')
        const finalData = additionalCharges?.additionalChargesData;

        let formData = new FormData();
        formData.append('json', JSON.stringify(finalData));
        const documents = additionalCharges?.additionalChargesDocs;
        if (documents && documents.length > 0) {
          let groupedDocuments = {};

          for (const doc of documents) {
            if (!groupedDocuments[doc.fileNumber]) {
              groupedDocuments[doc.fileNumber] = [];
            }
            groupedDocuments[doc.fileNumber].push({
              uri: doc.uri,
              type: doc.type,
              name: doc.name,
            });
          }

          // Append each file in correct format
          for (const key in groupedDocuments) {
            if (groupedDocuments[key].length > 0) {
              for (const file of groupedDocuments[key]) {
                if (file.uri) {
                  formData.append(key, {
                    uri: file.uri,
                    type: file.type,
                    name: file.name,
                  });
                }
              }
            }
          }
        }
        formData.append('customer_signature', {
          uri: fileInfo.uri,
          type: 'image/png',
          name: 'customer_signature.png',
        });
        const response = await postAdditionCharges(formData, userToken);
        console.log({ response })
        if (response?.error === false) {
          onClose();
          await fetch();
          if (goTo === true) {
            navigation.navigate('Bills');
          }
        }
      }
      if (additionalCharges == null) {
        console.log('other')
        const finalData = {
          post_booking_id: selectedTripData?.post_booking_id,
          accepted_user_id: userId,
          posted_user_id: selectedTripData?.posted_user_id,
        };

        let formData = new FormData();
        formData.append('json', JSON.stringify(finalData));
        formData.append('customer_signature', {
          uri: fileInfo.uri,
          type: 'image/png',
          name: 'customer_signature.png',
        });

        const response = await uploadSignature(formData, userToken);
        console.log('abc', response)
        if (response?.error === false) {
          onClose();
          await fetch();
          if (goTo === true) {
            navigation.navigate('Bills');
          }
        }
      }
    } catch (error) {
      console.error('Error uploading signature:', error);
    } finally {
      setIsProcessing(false);
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
      <TouchableOpacity
        style={{ position: 'absolute', top: 10, right: 10 }}
        onPress={onClose}
      >
        <FontAwesome name="times" size={24} color="#333" />
      </TouchableOpacity>

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
              :{' '}
              {selectedTripData?.user_name ||
                selectedTripData?.User_name ||
                'N/A'}
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
          <TouchableOpacity
            style={[styles.clearButton, isProcessing && styles.buttonDisabled]}
            onPress={handleClear}
            disabled={isProcessing}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, isProcessing && styles.buttonDisabled]}
            disabled={isProcessing}
            onPress={() => {
              if (signatureRef.current && !signatureFileInfo) {
                signatureRef.current.readSignature();
              }
            }}
          >
            <Text
              style={[
                styles.actionButtonText,
                isProcessing && styles.buttonTextDisabled,
              ]}
            >
              {isProcessing ? 'Processing...' : 'End Trip'}
            </Text>
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
  buttonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  buttonTextDisabled: {
    color: '#666666',
  },
});

export default CustomerSignatureModal;
