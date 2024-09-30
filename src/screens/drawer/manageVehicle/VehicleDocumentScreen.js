import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';


import {
  getVehicleDocsByVehicleId,
  getVehicleDocTypes,
  uploadVehicleDocs,
} from '../../../services/docsUploadService';
import { getUserDataSelector } from '../../../store/selectors';
import DocumentUploadCard from '../../../components/DocumentUploadCard';
import ImagePickerGrid from '../../../components/ImagePickerGrid';
import CustomTextInput from '../../../components/ui/CustomTextInput';
import CustomButton from '../../../components/ui/CustomButton';

import { useTheme } from '../../../hooks/useTheme';
import CustomText from '../../../components/ui/CustomText';
import { i18n } from '../../../constants/lang';



const VehicleDocumentScreen = () => {
  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;
  const userVehicleId = userData.userVehicleId;
  const { theme } = useTheme();

  const { control, handleSubmit } = useForm();

  const [vehicleDocTypes, setVehicleDocTypes] = useState([]);
  const [initialVehicleDocs, setInitialVehicleDocs] = useState(null);
  const [vehicleFiles, setVehicleFiles] = useState([]);
  const [vehicleImages, setVehicleImages] = useState(Array(4).fill(null));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVehicleDocs();
  }, []);

  useEffect(() => {
    getAllVehicleDocs();
  }, [userVehicleId, userToken]);

  const fetchVehicleDocs = async () => {
    try {
      const vehicleDocs = await getVehicleDocTypes();
      const sortedVehicleDocs = vehicleDocs?.response.sort(
        (a, b) => a.display_order - b.display_order,
      );
      setVehicleDocTypes(sortedVehicleDocs);
    } catch (error) {
      console.error('Error fetching vehicle document types:', error);
    }
  };

  const getAllVehicleDocs = async () => {
    const vehicleDocsResponse = await getVehicleDocsByVehicleId(userVehicleId, userToken);
    if (vehicleDocsResponse.data.length > 0) {
      setInitialVehicleDocs(vehicleDocsResponse.data);
    } else {
      setInitialVehicleDocs(null);
    }
  };

  const handleUpload = (fileName, fileUri, formDataKey, fileType) => {
    setVehicleFiles((prev) => [
      ...prev,
      {
        name: fileName,
        uri: fileUri,
        formDataKey: formDataKey,
        type: fileType,
      },
    ]);
  };

  const handleDelete = (indexToDelete) => {
    setVehicleFiles((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  const renderUploadSection = ({ item }) => {
    if (
      item.doc_id.includes(4) ||
      item.doc_id.includes(5) ||
      item.doc_id.includes(6) ||
      item.doc_id.includes(7)
    ) {
      return (
        <View style={styles.uploadSection}>
          <CustomText
            text={'Upload Car Photos'}
            variant={'activeText'}
          />
          <ImagePickerGrid
            noOfPhotos={4}
            onImagesPicked={setVehicleImages}
            images={vehicleImages}
            fileType={item.fileType}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.uploadSection}>
          <CustomText text={item.doc_label[0]} variant={'activeText'} />
          <View style={styles.uploadContainer}>
            <CustomTextInput
              control={control}
              name={`${item.doc_label[0]}`}
              placeholder={`${item.doc_label[0]} Number`}
            />
            <DocumentUploadCard
              title={item.doc_label[0]}
              fileNames={vehicleFiles
                .filter((file) => file.formDataKey === item.formData_key[0])
                .map((file) => file.name)}
              onUpload={(fileName, fileUri, fileType) => {
                handleUpload(
                  fileName,
                  fileUri,
                  item.formData_key[0],
                  fileType,
                );
              }}
              onDelete={(indexToDelete) =>
                handleDelete(
                  vehicleFiles.findIndex(
                    (file) => file.formDataKey === item.formData_key[0],
                  ) + indexToDelete,
                )
              }
              placeholders={[item.doc_label[0]]}
              maxFiles={1}
              fileType={item.fileType}
            />
          </View>
        </View>
      );
    }
  };

  const handleVehicleDocsSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();

    let jsonData = [];

    vehicleDocTypes.forEach((doc) => {
      if (doc.doc_id.length > 1) {
        for (let i = 0; i < doc.doc_id.length; i++) {
          jsonData.push({
            doc_id: doc.doc_id[i],
            doc_name: doc.doc_label[i],
            doc_number: data[`${doc.doc_label[i]}`] || '',
            doc_type: doc.fileType,
            vehicles_id: userVehicleId
          });
        }
      } else {
        jsonData.push({
          doc_id: doc.doc_id[0],
          doc_name: doc.doc_label[0],
          doc_number: data[`${doc.doc_label[0]}`] || '',
          doc_type: doc.fileType,
          vehicles_id: userVehicleId,
        });
      }
    });

    formData.append('json', JSON.stringify(jsonData));

    vehicleFiles.forEach((file) => {
      formData.append('image', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
    });

    vehicleImages.forEach((image, index) => {
      if (image) {
        formData.append('image', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `vehicle_image_${index}.jpg`,
        });
      }
    });

    try {
      const response = await uploadVehicleDocs(formData, userToken);
      console.log('response', response);
      // Handle successful upload
    } catch (error) {
      console.error('Error uploading vehicle docs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log({theme})
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <FlatList
          data={vehicleDocTypes}
          renderItem={renderUploadSection}
          keyExtractor={(item) => item.display_order.toString()}
        />

        <View style={styles.buttonContainer}>
          <CustomButton
            title={i18n.t('SIGNUP_BUTTON')}
            onPress={handleSubmit(handleVehicleDocsSubmit)}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  uploadSection: {
    marginBottom: 20,
  },
  uploadContainer: {
    rowGap: 20,
    borderWidth: 0.2,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
  },
});

export default VehicleDocumentScreen;