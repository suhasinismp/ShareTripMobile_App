import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

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
import { showSnackbar } from '../../../store/slices/snackBarSlice';
import AppHeader from '../../../components/AppHeader';

const VehicleDocumentScreen = () => {
  const dispatch = useDispatch();
  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;
  const userVehicleId = userData.userVehicleId;

  const { theme } = useTheme();

  const { control, handleSubmit, setValue } = useForm();

  const [vehicleDocTypes, setVehicleDocTypes] = useState([]);
  const [initialVehicleDocs, setInitialVehicleDocs] = useState(null);
  const [vehicleFiles, setVehicleFiles] = useState([]);
  const [vehicleImages, setVehicleImages] = useState(Array(4).fill(null));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVehicleDocs();
    getAllVehicleDocs();
  }, [userVehicleId, userToken]);

  useEffect(() => {
    if (initialVehicleDocs) {
      const files = initialVehicleDocs
        .filter((doc) => doc.field_value_id <= 3)
        .map((doc) => ({
          name: doc.doc_name,
          uri: doc.doc_upload,
          formDataKey: `doc_${doc.field_value_id}`,
          type: doc.doc_type,
        }));
      setVehicleFiles(files);

      const images = initialVehicleDocs
        .filter((doc) => doc.field_value_id >= 4 && doc.field_value_id <= 7)
        .sort((a, b) => a.field_value_id - b.field_value_id)
        .map((doc) => (doc.doc_upload ? { uri: doc.doc_upload } : null));
      setVehicleImages(images);

      // Set initial values for form fields
      initialVehicleDocs.forEach((doc) => {
        if (doc.field_value_id <= 3) {
          setValue(doc.doc_name, doc.doc_number);
        }
      });
    }
  }, [initialVehicleDocs, setValue]);

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
    try {
      const vehicleDocsResponse = await getVehicleDocsByVehicleId(
        userVehicleId,
        userToken,
      );

      if (vehicleDocsResponse.data.length > 0) {
        setInitialVehicleDocs(vehicleDocsResponse.data);
      } else {
        setInitialVehicleDocs(null);
      }
    } catch (error) {
      console.error('Error fetching vehicle docs:', error);
    }
  };

  const getFileNameFromUrl = (url) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
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
    setVehicleFiles((prev) =>
      prev.filter((_, index) => index !== indexToDelete),
    );
  };

  const renderUploadSection = ({ item }) => {
    const initialDoc = initialVehicleDocs
      ? initialVehicleDocs.find((doc) => doc.field_value_id === item.doc_id[0])
      : null;

    if (
      item.doc_id.includes(4) ||
      item.doc_id.includes(5) ||
      item.doc_id.includes(6) ||
      item.doc_id.includes(7)
    ) {
      return (
        <View style={styles.uploadSection}>
          <CustomText text={'Upload Car Photos'} variant={'activeText'} />
          <ImagePickerGrid
            noOfPhotos={4}
            onImagesPicked={setVehicleImages}
            images={vehicleImages}
            fileType={item.fileType}
          />
        </View>
      );
    } else {
      const fileName = initialDoc
        ? getFileNameFromUrl(initialDoc.doc_upload)
        : '';

      return (
        <View style={styles.uploadSection}>
          <CustomText text={item.doc_label[0]} variant={'activeText'} />
          <View style={styles.uploadContainer}>
            <CustomTextInput
              control={control}
              name={`${item.doc_label[0]}`}
              placeholder={`${item.doc_label[0]} Number`}
              defaultValue={initialDoc ? initialDoc.doc_number : ''}
            />
            <DocumentUploadCard
              title={item.doc_label[0]}
              fileNames={
                fileName
                  ? [fileName]
                  : vehicleFiles
                    .filter(
                      (file) => file.formDataKey === item.formData_key[0],
                    )
                    .map((file) => file.name)
              }
              onUpload={(fileName, fileUri, fileType) => {
                handleUpload(fileName, fileUri, item.formData_key[0], fileType);
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
              initialFile={
                initialDoc
                  ? { name: fileName, uri: initialDoc.doc_upload }
                  : null
              }
            />
          </View>
        </View>
      );
    }
  };
  const handleVehicleDocsSubmit = async (data) => {
    if (
      vehicleFiles.length === vehicleDocTypes.length - 1 &&
      vehicleImages.filter((image) => image !== null).length > 0
    ) {
      setIsLoading(true);
      const formData = new FormData();

      let jsonData = [];

      vehicleDocTypes.forEach((doc) => {
        if (doc.doc_id.length > 1) {
          for (let i = 0; i < doc.doc_id.length; i++) {
            const existingDoc = initialVehicleDocs
              ? initialVehicleDocs.find(
                (d) => d.field_value_id === doc.doc_id[i],
              )
              : null;
            jsonData.push({
              id: existingDoc ? existingDoc.id : undefined,
              doc_id: doc.doc_id[i],
              doc_name: doc.doc_label[i],
              doc_number: data[`${doc.doc_label[i]}`] || '',
              doc_type: doc.fileType,
              vehicles_id: userVehicleId,
            });
          }
        } else {
          const existingDoc = initialVehicleDocs
            ? initialVehicleDocs.find((d) => d.field_value_id === doc.doc_id[0])
            : null;
          jsonData.push({
            id: existingDoc ? existingDoc.id : undefined,
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
            name: `vehicle_image_${index}.jpeg`,
          });
        }
      });

      try {
        const response = await uploadVehicleDocs(formData, userToken);
        if (
          response.message === 'Vehicle docs created successfully' ||
          response.message === 'Vehicle docs updated successfully'
        ) {
          dispatch(
            showSnackbar({
              visible: true,
              message: response.message,
              type: 'success',
            }),
          );
          getAllVehicleDocs(); // Refresh the documents after successful upload/update
        }
      } catch (error) {
        console.error('Error uploading vehicle docs:', error);
        dispatch(
          showSnackbar({
            visible: true,
            message: 'Error uploading documents. Please try again.',
            type: 'error',
          }),
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      dispatch(
        showSnackbar({
          visible: true,
          message: 'Please upload all the required documents',
          type: 'error',
        }),
      );
    }
  };

  return (
    <>
      <AppHeader
        drawerIcon={true}
        onlineIcon={true}
        muteIcon={true}
        title={'Vehicle Documents'}
      />
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
            title={initialVehicleDocs ? 'Update Documents' : 'Next'}
            onPress={handleSubmit(handleVehicleDocsSubmit)}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </>
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
    marginTop: 20,
    alignSelf: 'flex-end',
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
