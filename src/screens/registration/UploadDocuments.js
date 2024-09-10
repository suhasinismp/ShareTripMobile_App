import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomSelect from '../../components/ui/CustomSelect';
import { useTheme } from '../../hooks/useTheme';
import CustomText from '../../components/ui/CustomText';
import DocumentUploadCard from '../../components/DocumentUploadCard';
import CustomButton from '../../components/ui/CustomButton';
import { i18n } from '../../constants/lang';

const UploadDocuments = () => {
  const { theme } = useTheme();
  const [documentsType, setDocumentsType] = useState('vehicle');
  const [rcFiles, setRcFiles] = useState([]);
  const [insuranceFiles, setInsuranceFiles] = useState([]);
  const [emissionFiles, setEmissionFiles] = useState([]);
  const [carImages, setCarImages] = useState([]);
  const [width, setWidth] = useState(0);

  const handleUpload = (setFiles) => (fileName, fileUri) => {
    // console.log({ fileName, fileUri });
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

  const renderVehicleSection = () => {
    return (
      <View>
        <DocumentUploadCard
          title="RC Copy"
          fileNames={rcFiles.map((file) => file.name)}
          placeholders={['RC Front', 'RC Back']}
          onUpload={handleUpload(setRcFiles)}
          onDelete={handleDelete(setRcFiles)}
        />
        <DocumentUploadCard
          title="Insurance Copy"
          fileNames={insuranceFiles.map((file) => file.name)}
          onUpload={handleUpload(setInsuranceFiles)}
          onDelete={handleDelete(setInsuranceFiles)}
        />
        <DocumentUploadCard
          title="Emission or Pollution"
          fileNames={emissionFiles.map((file) => file.name)}
          onUpload={handleUpload(setEmissionFiles)}
          onDelete={handleDelete(setEmissionFiles)}
        />
        <View>
          <CustomText
            text={'Upload Car Photos'}
            variant={'activeText'}
            style={{ marginTop: 20 }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            title={i18n.t('SKIP')}
            onPress={() => {}}
            variant="text"
          />
          {/* <CustomButton
              title={i18n.t('SIGNUP_BUTTON')}
              onPress={handleSubmit(onSubmit)}
            /> */}
          <CustomButton title={i18n.t('SIGNUP_BUTTON')} onPress={() => {}} />
        </View>
      </View>
    );
  };

  const renderDriverSection = () => {
    return (
      <View>
        <CustomText
          text={'Upload Your Driver Documents'}
          variant={'headerTitle'}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  docTypeContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 15,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default UploadDocuments;
