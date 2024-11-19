import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TripSummaryModal = ({
  tripSummaryData,
  setShowTripSummaryModal,
  setShowAdditionalCharges,
}) => {
  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Trip Details</Text>

      <View style={[styles.summaryContainer, styles.elevation]}>
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Opening Details</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Opening Kms:</Text>
            <Text style={styles.summaryValue}>
              {tripSummaryData?.openingKms || '-'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Opening Time:</Text>
            <Text style={styles.summaryValue}>
              {tripSummaryData?.openingTime || '-'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Opening Date:</Text>
            <Text style={styles.summaryValue}>
              {tripSummaryData?.openingDate || '-'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Closing Details</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Closing Kms:</Text>
            <Text style={styles.summaryValue}>
              {tripSummaryData?.closingKms || '-'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Closing Time:</Text>
            <Text style={styles.summaryValue}>
              {tripSummaryData?.closingTime || '-'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Closing Date:</Text>
            <Text style={styles.summaryValue}>
              {tripSummaryData?.closingDate || '-'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => {
          setShowTripSummaryModal(false);
          setShowAdditionalCharges(true);
        }}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
  },
  elevation: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  summarySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  nextButton: {
    backgroundColor: '#005680',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TripSummaryModal;
