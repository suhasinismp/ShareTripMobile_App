import { useNavigation } from '@react-navigation/native';
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
import DocumentUploadCard from '../../components/DocumentUploadCard';
import ImagePickerGrid from '../../components/ImagePickerGrid';
import CustomButton from '../../components/ui/CustomButton';
import CustomSelect from '../../components/ui/CustomSelect';
import CustomText from '../../components/ui/CustomText';
import CustomTextInput from '../../components/ui/CustomTextInput';
import { i18n } from '../../constants/lang';
import { useTheme } from '../../hooks/useTheme';
import {
  getUserDocsByUserId,
  getUserDocTypes,
  getVehicleDocsByVehicleId,
  getVehicleDocTypes,
  uploadDriverDocs,
  uploadVehicleDocs,
} from '../../services/docsUploadService';
import { getUserDataSelector } from '../../store/selectors';

const UploadDocumentsScreen = () => {
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;
  const userId = userData.userId;
  const userVehicleId = userData.userVehicleId;
  const { theme } = useTheme();
  const { control, handleSubmit, setValue, watch } = useForm();
  const [documentsType, setDocumentsType] = useState('vehicle');
  const [width, setWidth] = useState(0);

  const [vehicleDocTypes, setVehicleDocTypes] = useState([]);
  const [driverDocTypes, setDriverDocTypes] = useState([]);
  const [initialVehicleDocs, setInitialVehicleDocs] = useState(null);
  const [initialDriverDocs, setInitialDriverDocs] = useState(null);
  const [vehicleFiles, setVehicleFiles] = useState([]);
  const [driverFiles, setDriverFiles] = useState([]);
  const [vehicleImages, setVehicleImages] = useState(Array(4).fill(null));
  const [driverImages, setDriverImages] = useState(Array(1).fill(null));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const vehicleDocs = await getVehicleDocTypes();
      const sortedVehicleDocs = vehicleDocs?.response.sort(
        (a, b) => a.display_order - b.display_order,
      );
      setVehicleDocTypes(sortedVehicleDocs);

      const driverDocs = await getUserDocTypes();
      const sortedDriverDocs = driverDocs?.response.sort(
        (a, b) => a.display_order - b.display_order,
      );
      setDriverDocTypes(sortedDriverDocs);
    } catch (error) {
      console.error('Error fetching document types:', error);
    }
  };

  useEffect(() => {
    getAllDocs();
  }, [userVehicleId, userToken, userId]);

  const getAllDocs = async () => {
    const vehicleDocsResponse = await getVehicleDocsByVehicleId(
      userVehicleId,
      userToken,
    );
    const driverDocsResponse = await getUserDocsByUserId(userId, userToken);
    if (vehicleDocsResponse.data.length > 0) {
      setInitialVehicleDocs(vehicleDocsResponse.data);
    } else {
      setInitialVehicleDocs(null);
    }

    if (driverDocsResponse.noOfRecords > 0) {
      setInitialDriverDocs(driverDocsResponse.data);
    } else {
      setInitialDriverDocs(null);
    }

    setInitialVehicleDocs();
  };

  const handleUpload =
    (isDriver = false) =>
      (fileName, fileUri, formDataKey, fileType) => {
        const setFiles = isDriver ? setDriverFiles : setVehicleFiles;
        setFiles((prev) => [
          ...prev,
          {
            name: fileName,
            uri: fileUri,
            formDataKey: formDataKey,
            type: fileType,
          },
        ]);
      };

  const handleDelete =
    (isDriver = false) =>
      (indexToDelete) => {
        const setFiles = isDriver ? setDriverFiles : setVehicleFiles;
        setFiles((prev) => prev.filter((_, index) => index !== indexToDelete));
      };

  const renderUploadSection = ({ item }) => {
    const isDriver = documentsType === 'driver';
    const files = isDriver ? driverFiles : vehicleFiles;
    const images = isDriver ? driverImages : vehicleImages;
    const setImages = isDriver ? setDriverImages : setVehicleImages;

    if (
      item.doc_id.includes(4) ||
      item.doc_id.includes(5) ||
      item.doc_id.includes(6) ||
      item.doc_id.includes(7)
    ) {
      return (
        <View style={styles.uploadSection}>
          <CustomText
            text={isDriver ? 'Upload Driver Photo' : 'Upload Car Photos'}
            variant={'activeText'}
          />
          <ImagePickerGrid
            noOfPhotos={isDriver ? 1 : 4}
            onImagesPicked={setImages}
            images={images}
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
              fileNames={files
                .filter((file) => file.formDataKey === item.formData_key[0])
                .map((file) => file.name)}
              onUpload={(fileName, fileUri, fileType) => {
                handleUpload(isDriver)(
                  fileName,
                  fileUri,
                  item.formData_key[0],
                  fileType,
                );
              }}
              onDelete={(indexToDelete) =>
                handleDelete(isDriver)(
                  files.findIndex(
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

  const renderDocumentSection = () => {
    const data = documentsType === 'vehicle' ? vehicleDocTypes : driverDocTypes;
    return (
      <FlatList
        data={data}
        renderItem={renderUploadSection}
        keyExtractor={(item) => item.display_order.toString()}
      />
    );
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
            vehicles_id: userVehicleId,
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

      // Handle successful upload
    } catch (error) {
      console.error('Error uploading vehicle docs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriverDocsSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();

    let jsonData = [];

    driverDocTypes.forEach((doc) => {
      if (doc.doc_id.length > 1) {
        for (let i = 0; i < doc.doc_id.length; i++) {
          jsonData.push({
            doc_id: doc.doc_id[i],
            doc_name: doc.doc_label[i],
            doc_number: data[`${doc.doc_label[i]}`] || '',
            doc_type: doc.fileType,
            user_id: userId,
          });
        }
      } else {
        jsonData.push({
          doc_id: doc.doc_id[0],
          doc_name: doc.doc_label[0],
          doc_number: data[`${doc.doc_label[0]}`] || '',
          doc_type: doc.fileType,
          user_id: userId,
        });
      }
    });

    formData.append('json', JSON.stringify(jsonData));

    driverFiles.forEach((file) => {
      formData.append('image', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    });

    if (driverImages[0]) {
      formData.append('image', {
        uri: driverImages[0].uri,
        name: 'driver_photo.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      const response = await uploadDriverDocs(formData, userToken);
    } catch (error) {
      console.error('Error uploading vehicle docs:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <View
          style={styles.docTypeContainer}
          onLayout={(e) => {
            setWidth(e.nativeEvent.layout.width);
          }}
        >
          <CustomSelect
            text={'Vehicle'}
            isSelected={documentsType === 'vehicle'}
            onPress={() => {
              setDocumentsType('vehicle');
            }}
            containerStyle={{
              width: (width - 20) / 2,
              borderColor: theme.primaryColor,
              borderWidth: 1,
            }}
          />
          <CustomSelect
            text={'Driver'}
            isSelected={documentsType === 'driver'}
            onPress={() => {
              setDocumentsType('driver');
            }}
            containerStyle={{
              width: (width - 20) / 2,
              borderColor: theme.primaryColor,
              borderWidth: 1,
            }}
          />
        </View>

        {renderDocumentSection()}

        <View style={styles.buttonContainer}>
          <CustomButton
            title={i18n.t('SIGNUP_BUTTON')}
            onPress={handleSubmit(
              documentsType === 'vehicle'
                ? handleVehicleDocsSubmit
                : handleDriverDocsSubmit,
            )}
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
  docTypeContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 15,
    alignItems: 'center',
    marginBottom: 20,
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

export default UploadDocumentsScreen;
