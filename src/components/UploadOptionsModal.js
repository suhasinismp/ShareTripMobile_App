import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import Camera from '../../assets/svgs/camera.svg';
import Gallery from '../../assets/svgs/gallery.svg';
import File from '../../assets/svgs/file.svg';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

const InfoMessage = () => (
  <View style={styles.infoContainer}>
    <Text style={styles.infoText}>
      Upload clear scanned copies of original documents
    </Text>
    <Text style={styles.infoText}>
      Only PNG, JPEG files that are of 2MB and PDF files of 5MB can be uploaded
      at a time
    </Text>
  </View>
);

const UploadOptionsModal = ({
  visible,
  onClose,
  onSelectFile,
  camera,
  gallery,
  pdf,
}) => {
  const getFileSize = async (uri) => {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    return fileInfo.size;
  };

  const checkFileSize = async (uri, fileType) => {
    const fileSize = await getFileSize(uri);
    const fileSizeInMB = fileSize / (1024 * 1024);
    let maxSize;

    if (fileType === 'pdf') {
      maxSize = 5;
    } else if (fileType === 'image') {
      maxSize = 2;
    } else {
      maxSize = 2; // Default to image size for other types
    }

    if (fileSizeInMB > maxSize) {
      Alert.alert(
        'File Too Large',
        `The ${fileType} file size should not exceed ${maxSize} MB.`,
      );
      return false;
    }
    return true;
  };

  const compressImage = async (uri, quality = 0.9, width = 1080) => {
    try {
      const originalSize = await getFileSize(uri);

      // Skip compression for files smaller than 1.5 MB
      if (originalSize <= 0.7 * 1024 * 1024) {
        return uri;
      }

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width } }],
        { compress: quality, format: ImageManipulator.SaveFormat.JPEG },
      );

      const compressedSize = await getFileSize(manipulatedImage.uri);

      return compressedSize < originalSize ? manipulatedImage.uri : uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      return uri;
    }
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const processedUri = await compressImage(result.assets[0].uri);
        if (await checkFileSize(processedUri, 'image')) {
          onSelectFile({
            name: result.assets[0].fileName || 'camera_image.jpg',
            uri: processedUri,
          });
        }
      }
    }
    onClose();
  };

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const processedUri = await compressImage(result.assets[0].uri);
      const uriParts = processedUri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      if (await checkFileSize(processedUri, 'image')) {
        onSelectFile({
          name: fileName || 'gallery_image.jpg',
          uri: processedUri,
          type: result.assets[0].mimeType,
        });
      }
    }
    onClose();
  };

  const handleFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: false,
    });
    if (result.canceled === false) {
      if (await checkFileSize(result.assets[0].uri, 'pdf')) {
        onSelectFile({
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType,
        });
      }
    }
    onClose();
  };

  const options = [
    { Icon: Camera, text: 'Take a photo', onPress: handleCamera, show: camera },
    {
      Icon: Gallery,
      text: 'Upload from Photo Gallery',
      onPress: handleGallery,
      show: gallery,
    },
    {
      Icon: File,
      text: 'Upload from Local Files',
      onPress: handleFiles,
      show: pdf,
    },
  ];

  // If no props are passed, show all options
  const showAllOptions =
    camera === undefined && gallery === undefined && pdf === undefined;

  const visibleOptions = showAllOptions
    ? options
    : options.filter((option) => option.show);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <ScrollView>
            <InfoMessage />
            {visibleOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={option.onPress}
              >
                <option.Icon width={24} height={24} fill="#3498db" />
                <Text style={styles.optionText}>{option.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '50%',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  infoContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});

export default UploadOptionsModal;
