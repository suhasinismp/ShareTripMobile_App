import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import UploadIcon from '../../assets/svgs/upload.svg';
import DeleteIcon from '../../assets/svgs/delete.svg';
import UploadOptionsModal from './UploadOptionsModal';

const DocumentUploadCard = ({
  title,
  fileNames = [],
  onUpload,
  onDelete,
  containerStyle,
  titleContainerStyle,
  titleStyle,
  fileInfoContainerStyle,
  fileNameStyle,
  placeholderStyle,
  iconColor = '#4A55A2',
  deleteIconColor = '#FF6B6B',
  uploadIconSize = 20,
  deleteIconSize = 20,
  dividerStyle,
  maxFiles = Infinity,
  placeholders = [],
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item, index }) => {
    const isPlaceholder = index >= fileNames.length;
    return (
      <View style={[styles.fileInfoContainer, fileInfoContainerStyle]}>
        <Text
          style={[
            styles.fileName,
            isPlaceholder ? placeholderStyle : fileNameStyle,
          ]}
        >
          {isPlaceholder ? placeholders[index] : item}
        </Text>
        <TouchableOpacity
          onPress={() => (isPlaceholder ? handleUpload() : onDelete(index))}
        >
          {isPlaceholder ? (
            <UploadIcon
              width={uploadIconSize}
              height={uploadIconSize}
              fill={iconColor}
            />
          ) : (
            <DeleteIcon
              width={deleteIconSize}
              height={deleteIconSize}
              fill={deleteIconColor}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const displayItems =
    placeholders.length > 0
      ? [...fileNames, ...placeholders.slice(fileNames.length)]
      : fileNames;

  const showUploadIcon =
    placeholders.length === 0 && fileNames.length < maxFiles;

  const handleUpload = () => {
    if (fileNames.length < maxFiles) {
      setModalVisible(true);
    }
  };

  const handleSelectFile = (file) => {
    const fileName = file.name;
    onUpload(fileName, file.uri);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.titleContainer, titleContainerStyle]}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {showUploadIcon && (
          <TouchableOpacity onPress={handleUpload}>
            <UploadIcon
              width={uploadIconSize}
              height={uploadIconSize}
              fill={iconColor}
            />
          </TouchableOpacity>
        )}
      </View>
      {displayItems.length > 0 && (
        <>
          <View style={[styles.divider, dividerStyle]} />
          <FlatList
            data={displayItems}
            renderItem={renderItem}
            keyExtractor={(item, index) => `item-${index}`}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
        </>
      )}
      <UploadOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectFile={handleSelectFile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  fileInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  fileName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
});

export default DocumentUploadCard;
