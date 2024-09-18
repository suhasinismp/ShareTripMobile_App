import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import Camera from '../../assets/svgs/camera.svg';
import Gallery from '../../assets/svgs/gallery.svg';
import File from '../../assets/svgs/file.svg';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

const UploadOptionsModal = ({ visible, onClose, onSelectFile }) => {
  const getFileSize = async (uri) => {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    return fileInfo.size;
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
        onSelectFile({
          name: result.assets[0].fileName || 'camera_image.jpg',
          uri: processedUri,
        });
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
      onSelectFile({
        name: result.assets[0].fileName || 'gallery_image.jpg',
        uri: processedUri,
      });
    }
    onClose();
  };

  const handleFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: false,
    });
    if (result.canceled === false) {
      onSelectFile({
        uri: result.assets[0].uri,
        name: result.assets[0].name,
        type: result.assets[0].mimeType,
      });
    }
    onClose();
  };

  const options = [
    { Icon: Camera, text: 'Take a photo', onPress: handleCamera },
    {
      Icon: Gallery,
      text: 'Upload from Photo Gallery',
      onPress: handleGallery,
    },
    { Icon: File, text: 'Upload from Local Files', onPress: handleFiles },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={option.onPress}
            >
              <option.Icon width={24} height={24} fill="#3498db" />
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
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
});

export default UploadOptionsModal;
