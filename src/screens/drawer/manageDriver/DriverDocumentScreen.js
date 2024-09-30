import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import DocumentUploadCard from '../../components/DocumentUploadCard';
import CustomButton from '../../components/ui/CustomButton';
import CustomText from '../../components/ui/CustomText';
import CustomTextInput from '../../components/ui/CustomTextInput';
import { i18n } from '../../constants/lang';
import { useTheme } from '../../hooks/useTheme';
import { getUserDocTypes, uploadDriverDocs } from '../../services/docsUploadService';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';

const DriverDocumentScreen = () => {
  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;
  const userId = userData.userId;
  const { theme } = useTheme();
  const { control, handleSubmit } = useForm();
  const [driverDocTypes, setDriverDocTypes] = useState([]);
  const [driverFiles, setDriverFiles] = useState([]);
  const [driverImages, setDriverImages] = useState(Array(1).fill(null));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDriverDocs();
  }, []);

  const fetchDriverDocs = async () => {
    try {
      const driverDocs = await getUserDocTypes();
      const sortedDriverDocs = driverDocs?.response.sort((a, b) => a.display_order - b.display_order);
      setDriverDocTypes(sortedDriverDocs);
    } catch (error) {
      console.error('Error fetching driver document types:', error);
    }
  };

  const handleDriverUpload = (fileName, fileUri, formDataKey, fileType) => {
    setDriverFiles((prev) => [
      ...prev,
      { name: fileName, uri: fileUri, formDataKey: formDataKey, type: fileType },
    ]);
  };

  const handleDeleteDriverFile = (indexToDelete) => {
    setDriverFiles((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  const renderDriverUploadSection = ({ item }) => (
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
          fileNames={driverFiles
            .filter((file) => file.formDataKey === item.formData_key[0])
            .map((file) => file.name)}
          onUpload={(fileName, fileUri, fileType) =>
            handleDriverUpload(fileName, fileUri, item.formData_key[0], fileType)
          }
          onDelete={() =>
            handleDeleteDriverFile(
              driverFiles.findIndex((file) => file.formDataKey === item.formData_key[0])
            )
          }
          maxFiles={1}
        />
      </View>
    </View>
  );

  const handleDriverDocsSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    const jsonData = driverDocTypes.map((doc) => ({
      doc_id: doc.doc_id[0],
      doc_name: doc.doc_label[0],
      doc_number: data[`${doc.doc_label[0]}`] || '',
      doc_type: doc.fileType,
      user_id: userId,
    }));

    formData.append('json', JSON.stringify(jsonData));

    driverFiles.forEach((file) => {
      formData.append('image', { uri: file.uri, type: file.type, name: file.name });
    });

    driverImages.forEach((image, index) => {
      if (image) {
        formData.append('image', { uri: image.uri, type: 'image/jpeg', name: `driver_image_${index}.jpg` });
      }
    });

    try {
      const response = await uploadDriverDocs(formData, userToken);
      console.log('response', response);
    } catch (error) {
      console.error('Error uploading driver docs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <FlatList
          data={driverDocTypes}
          renderItem={renderDriverUploadSection}
          keyExtractor={(item) => item.display_order.toString()}
        />
        <View style={styles.buttonContainer}>
          <CustomButton
            title={i18n.t('SIGNUP_BUTTON')}
            onPress={handleSubmit(handleDriverDocsSubmit)}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollViewContent: { padding: 20 },
  uploadSection: { marginBottom: 20 },
  uploadContainer: { borderWidth: 0.2, borderColor: '#ccc', padding: 10, marginTop: 10 },
  buttonContainer: { marginTop: 20 },
});

export default DriverDocumentScreen;
