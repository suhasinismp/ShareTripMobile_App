import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import CustomButton from './CustomButton';

const CustomModal = ({
  visible,
  title,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryAction,
  onSecondaryAction,
  icon,
  children,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {children ? (
            children
          ) : (
            <>
              <View style={styles.iconContainer}>{icon}</View>
              <CustomText
                variant="headerTitle"
                text={title}
                style={styles.title}
              />
              <CustomText
                variant="body"
                text={subtitle}
                style={styles.subtitle}
              />
              <CustomButton
                title={primaryButtonText}
                onPress={onPrimaryAction}
                variant="primary"
                style={styles.primaryButton}
              />
              <CustomButton
                title={secondaryButtonText}
                onPress={onSecondaryAction}
                variant="text"
                style={styles.secondaryButton}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'left',
  },
  primaryButton: {
    backgroundColor: '#123F67',
    marginBottom: 10,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#D0D5DD',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomModal;
