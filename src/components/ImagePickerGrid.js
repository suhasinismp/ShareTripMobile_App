import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UploadOptionsModal from './UploadOptionsModal';

const ImagePickerGrid = ({ noOfPhotos = 4, onImagesPicked, images }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleImagePick = (imageData) => {
    const newImages = [...images];
    newImages[currentIndex] = imageData.uri;
    onImagesPicked(newImages.filter(Boolean));
    setModalVisible(false);
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
          <Image source={{ uri: image }} style={styles.image} />
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
});

export default ImagePickerGrid;
