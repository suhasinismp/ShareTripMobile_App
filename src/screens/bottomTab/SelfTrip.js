import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import CustomText from '../../components/ui/CustomText';
import CustomInput from '../../components/ui/CustomInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const [customerName, setCustomerName] = useState('');
const [customerPhone, setCustomerPhone] = useState('');



const renderSelfTripContent = () => {
  <>
    <View style={{ ...styles.sectionContainer, gap: 10 }}>
      <CustomText text={'Customer Details :'} variant={'sectionTitleText'} />
      <CustomInput
        placeholder="customer Name"
        value={customerName}
        onChangeText={setCustomerName}
      />
      <CustomInput
        placeholder="customer Phone"
        value={customerPhone}
        onChangeText={setCustomerPhone}
      />


    </View>

  </>
}
const SelfTrip = () => {
  return (
    <>
      <AppHeader
        drawerIcon={true}
        groupIcon={true}
        onlineIcon={true}
        muteIcon={true}
        search={true} />

      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          { backgroundColor: theme.backgroundColor },
        ]}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <CustomSelect />
          text={'selfTrip'}
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'F3F5FD',
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  }

});

export default SelfTrip;
