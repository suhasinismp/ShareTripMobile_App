import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import CustomInput from '../../components/ui/CustomInput';
import UploadOptionsModal from '../../components/UploadOptionsModal';

const AdditionalChargesModal = ({ onNext, onClose }) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [activeField, setActiveField] = useState('');
  const [documents, setDocuments] = useState([]);
  const [charges, setCharges] = useState({
    advance: '',
    parking: '',
    tolls: '',
    stateTax: '',
    cleaning: '',
    nightBatta: '',
  });

  const fieldToFileNumber = {
    advance: 'file1',
    parking: 'file2',
    tolls: 'file3',
    stateTax: 'file4',
    cleaning: 'file5',
  };

  const handleUpload = (field) => {
    setActiveField(field);
    setUploadModalVisible(true);
  };

  const handleFileSelect = (file) => {
    const fileNumber = fieldToFileNumber[activeField];
    const newFile = {
      ...file,
      fileNumber,
    };

    const existingFileIndex = documents.findIndex(
      (doc) => doc.fileNumber === fileNumber,
    );

    if (existingFileIndex !== -1) {
      setDocuments((prev) =>
        prev.map((doc, index) => (index === existingFileIndex ? newFile : doc)),
      );
    } else {
      setDocuments((prev) => [...prev, newFile]);
    }

    setUploadModalVisible(false);
  };

  const handleRemoveDocument = (fileNumber) => {
    setDocuments((prev) => prev.filter((doc) => doc.fileNumber !== fileNumber));
  };

  const isFieldHasDocument = (field) => {
    return documents.some((doc) => doc.fileNumber === fieldToFileNumber[field]);
  };

  const chargeFields = [
    { id: 'advance', label: 'Advance', hasUpload: true },
    { id: 'parking', label: 'Parking', hasUpload: true },
    { id: 'tolls', label: 'Tolls', hasUpload: true },
    { id: 'stateTax', label: 'State Tax', hasUpload: true },
    { id: 'cleaning', label: 'Cleaning', hasUpload: true },
    { id: 'nightBatta', label: 'Night Batta', hasUpload: false },
  ];

  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 10, right: 10 }}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        onPress={onClose}
      >
        <FontAwesome name="times" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>Additional Charges</Text>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {chargeFields.map((field) => (
            <View key={field.id} style={styles.fieldContainer}>
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <CustomInput
                    placeholder={field.label}
                    value={charges[field.id]}
                    onChangeText={(text) =>
                      setCharges((prev) => ({ ...prev, [field.id]: text }))
                    }
                    keyboardType="numeric"
                    height={44}
                  />
                </View>
                {field.hasUpload && (
                  <TouchableOpacity
                    style={[
                      styles.uploadButton,
                      isFieldHasDocument(field.id) &&
                        styles.uploadButtonWithDoc,
                    ]}
                    onPress={() => handleUpload(field.id)}
                  >
                    <FontAwesome
                      name={isFieldHasDocument(field.id) ? 'check' : 'plus'}
                      size={16}
                      color="#FFF"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          {documents.length > 0 && (
            <View style={styles.documentsContainer}>
              <Text style={styles.documentsTitle}>Documents</Text>
              <View style={styles.documentsList}>
                {documents.map((doc) => (
                  <View key={doc.fileNumber} style={styles.documentChip}>
                    <Text style={styles.documentName}>{doc.name}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveDocument(doc.fileNumber)}
                      style={styles.removeButton}
                    >
                      <FontAwesome name="times" size={14} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => onNext(documents, charges)}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <UploadOptionsModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        onSelectFile={handleFileSelect}
        camera={true}
        gallery={true}
        pdf={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 600,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  scrollContentContainer: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  uploadButton: {
    width: 44,
    height: 44,
    backgroundColor: '#005680',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  uploadButtonWithDoc: {
    backgroundColor: '#28a745',
  },
  documentsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  documentsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  documentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  documentName: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextButton: {
    backgroundColor: '#005680',
    padding: 16,
    borderRadius: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AdditionalChargesModal;
