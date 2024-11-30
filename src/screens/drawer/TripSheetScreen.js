import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '../../hooks/useTheme';
import CustomText from '../../components/ui/CustomText';
import CustomInput from '../../components/ui/CustomInput';

const TripSheetScreen = ({ route }) => {
  const { postData } = route.params;
  const { theme } = useTheme();

  const [tripData, setTripData] = useState(postData);
  const [customerName, setCustomerName] = useState(postData?.User_name);
  const [customerPhone, setCustomerPhone] = useState(postData?.User_phone);
  const [tripType, setTripType] = useState(postData?.bookingType_name);
  const [tripPackage, setTripPackage] = useState(
    postData?.bookingTypePackage_name,
  );
  const [tripVehicleType, setTripVehicleType] = useState(
    postData?.Vehicle_type_name,
  );
  const [tripVehicleName, setTripVehicleName] = useState(
    postData?.Vehicle_name,
  );
  const [rate, setRate] = useState(postData?.bookingTypeTariff_base_fare_rate);

  const [paymentType, setPaymentType] = useState(postData?.payment_type);

  return (
    <View style={styles.container}>
      <AppHeader
        backIcon={true}
        onlineIcon={true}
        muteIcon={true}
        title={'Trip Sheet'}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={styles.contentContainer}>
          <View style={styles.sectionContainer}>
            <CustomText
              text={'Customer Details :'}
              variant={'sectionTitleText'}
            />
            <CustomInput
              placeholder="Customer Name"
              value={customerName}
              onChangeText={setCustomerName}
              editable={postData?.User_name ? false : true}
            />
            <CustomInput
              placeholder="Customer Phone"
              value={customerPhone}
              onChangeText={setCustomerPhone}
              keyboardType="phone-pad"
              editable={postData?.User_phone ? false : true}
            />
            <CustomText text={'Trip Type :'} variant={'sectionTitleText'} />
            <CustomInput
              placeholder="Trip Type"
              value={tripType}
              onChangeText={setTripType}
              editable={postData?.bookingType_name ? false : true}
            />
            <CustomText text={'Package :'} variant={'sectionTitleText'} />
            <CustomInput
              placeholder="Package"
              value={tripPackage}
              onChangeText={setTripPackage}
              editable={postData?.bookingTypePackage_name ? false : true}
            />
            <CustomText text={'Vehicle Type :'} variant={'sectionTitleText'} />
            <CustomInput
              placeholder="Vehicle Type"
              value={tripVehicleType}
              onChangeText={setTripVehicleType}
              editable={postData?.Vehicle_type_name ? false : true}
            />
            <CustomText text={'Vehicle Name :'} variant={'sectionTitleText'} />
            <CustomInput
              placeholder="Vehicle Name"
              value={tripVehicleName}
              onChangeText={setTripVehicleName}
              editable={postData?.Vehicle_name ? false : true}
            />
            <View style={styles.tariffSection}>
              <CustomText text={'Tariff :'} variant={'sectionTitleText'} />
              <View style={styles.tariffContainer}>
                <View style={styles.tariffRow}>
                  <CustomInput
                    placeholder="Rate"
                    value={rate}
                    onChangeText={setRate}
                    style={styles.tariffInput}
                    keyboardType="numeric"
                    editable={
                      postData?.bookingTypeTariff_base_fare_rate ? false : true
                    }
                  />
                </View>
              </View>
            </View>
            <CustomText
              text={'Payment / Duty Type :'}
              variant={'sectionTitleText'}
            />
            <CustomInput
              placeholder="Payment / Duty Type"
              value={paymentType}
              onChangeText={setPaymentType}
              editable={postData?.payment_type ? false : true}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  sectionContainer: {
    gap: 10,
  },
  tariffSection: {
    marginTop: 10,
  },
  tariffContainer: {
    marginTop: 8,
  },
  tariffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tariffInput: {
    width: '100%',
    height: 30,
  },
});

export default TripSheetScreen;
