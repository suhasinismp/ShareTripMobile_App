import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UploadOptionsModal from './UploadOptionsModal';

const ImagePickerGrid = ({
  noOfPhotos = 4,
  onImagesPicked,
  images,
  fileType,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleImagePick = (imageData) => {
    const newImages = [...images];
    newImages[currentIndex] = imageData.uri;
    onImagesPicked(newImages.filter(Boolean));
    setModalVisible(false);
  };

  const handleDeleteImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    onImagesPicked(newImages.filter(Boolean));
  };

  const renderImagePlaceholder = (index) => {
    const image = images[index];
    return (
      <TouchableOpacity
        style={styles.imagePlaceholder}
        onPress={() => {
          setCurrentIndex(index);
          setModalVisible(true);
        }}
      >
        {image ? (
          <>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteImage(index)}
            >
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </>
        ) : (
          <Ionicons name="camera-outline" size={24} color="#888" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {Array(noOfPhotos)
          .fill()
          .map((_, index) => (
            <View key={index} style={styles.gridItem}>
              {renderImagePlaceholder(index)}
            </View>
          ))}
      </View>
      <UploadOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectFile={handleImagePick}
        camera={fileType === 'image' || fileType === 'all'}
        gallery={fileType === 'image' || fileType === 'all'}
        pdf={fileType === 'pdf' || fileType === 'all'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
    aspectRatio: 1,
    padding: 5,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
  },
});

export default ImagePickerGrid;
