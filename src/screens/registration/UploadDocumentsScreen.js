import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, SafeAreaView } from 'react-native';
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

const UploadDocumentsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { control, handleSubmit, setValue, watch } = useForm();
  const [documentsType, setDocumentsType] = useState('vehicle');
  const [width, setWidth] = useState(0);

  // Vehicle section states
  const [vehicleRcFiles, setVehicleRcFiles] = useState([]);
  const [vehicleInsuranceFiles, setVehicleInsuranceFiles] = useState([]);
  const [vehicleEmissionFiles, setVehicleEmissionFiles] = useState([]);
  const [vehicleImages, setVehicleImages] = useState(Array(4).fill(null));

  // Driver section states
  const [driverLicenseFiles, setDriverLicenseFiles] = useState([]);
  const [driverAadhaarFiles, setDriverAadhaarFiles] = useState([]);
  const [driverVerificationFiles, setDriverVerificationFiles] = useState([]);
  const [driverImages, setDriverImages] = useState(Array(1).fill(null));

  const handleUpload = (setFiles) => (fileName, fileUri) => {
    setFiles((previousFiles) => {
      const newFile = { name: fileName, uri: fileUri };
      return [...previousFiles, newFile];
    });
  };

  const handleDelete = (setFiles) => (indexToDelete) => {
    setFiles((previousFiles) => {
      return previousFiles.filter((_, index) => index !== indexToDelete);
    });
  };

  const handleVehicleDocsSubmit = () => {
    setDocumentsType('driver');
  };

  const handleDriverDocsSubmit = () => {
    // navigation.navigate('SubscriptionPlans');
  };

  const renderUploadSection = (
    title,
    numberName,
    fileName,
    files,
    setFiles,
    placeholders,
  ) => (
    <View style={styles.uploadSection}>
      <CustomText text={title} variant={'activeText'} />
      <View style={styles.uploadContainer}>
        <CustomTextInput
          control={control}
          name={numberName}
          placeholder={`${title} Number`}
        />
        <CustomTextInput
          control={control}
          name={fileName}
          placeholder={'File name'}
        />
        <DocumentUploadCard
          title={title}
          fileNames={files.map((file) => file.name)}
          onUpload={handleUpload(setFiles)}
          onDelete={handleDelete(setFiles)}
          placeholders={placeholders}
        />
      </View>
    </View>
  );

  const renderVehicleSection = () => {
    return (
      <View>
        {renderUploadSection(
          'RC Copy',
          'rcNumber',
          'rcFileName',
          vehicleRcFiles,
          setVehicleRcFiles,
        )}
        {renderUploadSection(
          'Insurance Copy',
          'insuranceNumber',
          'insuranceFileName',
          vehicleInsuranceFiles,
          setVehicleInsuranceFiles,
        )}
        {renderUploadSection(
          'Emission or Pollution',
          'emissionNumber',
          'emissionFileName',
          vehicleEmissionFiles,
          setVehicleEmissionFiles,
        )}
        <View style={styles.uploadSection}>
          <CustomText text={'Upload Car Photos'} variant={'activeText'} />
          <ImagePickerGrid
            noOfPhotos={4}
            onImagesPicked={setVehicleImages}
            images={vehicleImages}
          />
        </View>
      </View>
    );
  };

  const renderDriverSection = () => {
    return (
      <View>
        {renderUploadSection(
          'Driver License',
          'licenseNumber',
          'licenseFileName',
          driverLicenseFiles,
          setDriverLicenseFiles,
        )}
        {renderUploadSection(
          'Aadhaar Card',
          'aadhaarNumber',
          'aadhaarFileName',
          driverAadhaarFiles,
          setDriverAadhaarFiles,
        )}
        {renderUploadSection(
          'Police Verification',
          'verificationNumber',
          'verificationFileName',
          driverVerificationFiles,
          setDriverVerificationFiles,
        )}
        <View style={styles.uploadSection}>
          <CustomText text={'Upload Photos'} variant={'activeText'} />
          <ImagePickerGrid
            noOfPhotos={1}
            onImagesPicked={setDriverImages}
            images={driverImages}
          />
        </View>
      </View>
    );
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
            containerStyle={{ width: (width - 20) / 2 }}
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

        {documentsType === 'vehicle'
          ? renderVehicleSection()
          : renderDriverSection()}

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
