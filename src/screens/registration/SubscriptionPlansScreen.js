import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { getSubscriptionPlans } from '../../services/subscriptionPlansService';
import { useDispatch, useSelector } from 'react-redux';
import { showSnackbar } from '../../store/slices/snackBarSlice';
import { getUserDataSelector } from '../../store/selectors';

const SubscriptionPlansScreen = ({ route }) => {
  const userData = useSelector(getUserDataSelector);
  const roleId = userData?.userRoleId;
  const userRoleId = route?.params?.userRoleId || roleId;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [plansData, setPlansData] = useState([]);
  const [driverPlans, setDriverPlans] = useState([]);
  const [travelAgencyPlans, setTravelAgencyPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [modalDetails, setModalDetails] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const cardColors = ['#3498db', '#f39c12', '#2ecc71'];

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (plansData.length > 0) {
      const activePlans = plansData.filter((plan) => plan.is_active === true);
      const driverPlans = activePlans.filter((plan) => plan.role_id === 3000);
      const agencyPlans = activePlans.filter((plan) => plan.role_id === 4000);
      setDriverPlans(driverPlans);
      setTravelAgencyPlans(agencyPlans);
    }
  }, [plansData]);

  const fetchPlans = async () => {
    try {
      const response = await getSubscriptionPlans();
      if (response?.data) {
        setPlansData(response.data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const selectPlan = (plan) => {
    setSelectedPlan(plan.id);
  };

  const openDetailsModal = (plan) => {
    setModalDetails(plan.plan_details);
    setModalTitle(`${plan.plan_name} Details`);
    setDetailsModalVisible(true);
  };

  const handlePayment = () => {
    if (selectedPlan) {
      setSuccessModalVisible(true);
    } else {
      dispatch(
        showSnackbar({
          visible: true,
          message: 'Please select a plan',
          type: 'error',
        }),
      );
    }
  };

  const renderCard = ({ item: plan, index }) => {
    const backgroundColor = cardColors[index % cardColors.length];
    const isSelected = selectedPlan === plan.id;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor },
          isSelected && styles.selectedCard,
        ]}
        onPress={() => selectPlan(plan)}
      >
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>Selected</Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.planName}>{plan.plan_name}</Text>
          <Text style={styles.planPrice}>₹{plan.plan_price}</Text>
          <Text style={styles.planValidity}>{plan.plan_validity} days</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.viewDetailsContainer,
            isSelected && styles.selectedViewDetails,
          ]}
          onPress={() => openDetailsModal(plan)}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const plansToShow = userRoleId === 3000 ? driverPlans : travelAgencyPlans;

  return (
    <View style={styles.container}>
      <FlatList
        data={plansToShow}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
        <Text style={styles.paymentButtonText}>Proceed to Pay</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalDetails}>{modalDetails}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDetailsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.successModalContent}>
            <Text style={styles.successModalTitle}>Payment Successful!</Text>
            <Text style={styles.successModalText}>
              Your subscription has been activated.
            </Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.navigate('SignIn');
              }}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 20,
    elevation: 5,
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: '#fff',
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    zIndex: 1,
  },
  selectedBadgeText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardContent: {
    padding: 20,
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  planValidity: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  viewDetailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    alignItems: 'center',
  },
  selectedViewDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  viewDetailsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paymentButton: {
    backgroundColor: '#005680',
    padding: 15,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  modalDetails: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  successModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2ecc71',
  },
  successModalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  okButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SubscriptionPlansScreen;
