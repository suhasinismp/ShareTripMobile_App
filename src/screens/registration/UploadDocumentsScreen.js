import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
} from 'react-native';
import CustomSelect from '../../components/ui/CustomSelect';
import { useTheme } from '../../hooks/useTheme';
import CustomText from '../../components/ui/CustomText';
import DocumentUploadCard from '../../components/DocumentUploadCard';
import CustomButton from '../../components/ui/CustomButton';
import CustomTextInput from '../../components/ui/CustomTextInput';
import { i18n } from '../../constants/lang';
import { useNavigation } from '@react-navigation/native';
import ImagePickerGrid from '../../components/ImagePickerGrid';
import { useForm } from 'react-hook-form';
import {
  getUserDocTypes,
  getVehicleDocTypes,
} from '../../services/docsUploadService';

const UploadDocumentsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { control, handleSubmit, setValue, watch } = useForm();
  const [documentsType, setDocumentsType] = useState('vehicle');
  const [width, setWidth] = useState(0);

  const [vehicleDocTypes, setVehicleDocTypes] = useState([]);
  const [driverDocTypes, setDriverDocTypes] = useState([]);
  const [vehicleFiles, setVehicleFiles] = useState({});
  const [driverFiles, setDriverFiles] = useState({});
  const [vehicleImages, setVehicleImages] = useState(Array(4).fill(null));
  const [driverImages, setDriverImages] = useState(Array(1).fill(null));

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
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
  };

  const handleUpload =
    (formDataKey, isDriver = false) =>
    (fileName, fileUri) => {
      const setFiles = isDriver ? setDriverFiles : setVehicleFiles;
      setFiles((prev) => ({
        ...prev,
        [formDataKey]: [
          ...(prev[formDataKey] || []),
          { name: fileName, uri: fileUri },
        ],
      }));
    };

  const handleDelete =
    (formDataKey, isDriver = false) =>
    (indexToDelete) => {
      const setFiles = isDriver ? setDriverFiles : setVehicleFiles;
      setFiles((prev) => ({
        ...prev,
        [formDataKey]: prev[formDataKey].filter(
          (_, index) => index !== indexToDelete,
        ),
      }));
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
              name={`${item.doc_label[0]}Number`}
              placeholder={`${item.doc_label[0]} Number`}
            />
            <DocumentUploadCard
              title={item.doc_label[0]}
              fileNames={(files[item.formData_key[0]] || []).map(
                (file) => file.name,
              )}
              onUpload={handleUpload(item.formData_key[0], isDriver)}
              onDelete={handleDelete(item.formData_key[0], isDriver)}
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

  const handleVehicleDocsSubmit = () => {
    setDocumentsType('driver');
  };

  const handleDriverDocsSubmit = () => {
    // navigation.navigate('SubscriptionPlans');
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
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
            title={i18n.t('SKIP')}
            onPress={
              documentsType === 'vehicle'
                ? handleVehicleDocsSubmit
                : handleDriverDocsSubmit
            }
            variant="text"
          />
          <CustomButton
            title={i18n.t('SIGNUP_BUTTON')}
            onPress={
              documentsType === 'vehicle'
                ? handleVehicleDocsSubmit
                : handleDriverDocsSubmit
            }
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
