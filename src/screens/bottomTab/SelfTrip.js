import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import CustomText from '../../components/ui/CustomText';
import CustomInput from '../../components/ui/CustomInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../../components/ui/CustomButton';
import { useTheme } from '../../hooks/useTheme';
import CustomSelect from '../../components/ui/CustomSelect';


const SelfTrip = () => {
  const { theme } = useTheme();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isRecording, setIsRecording] = useState('false');
  const [RecordedAudioUri, setRecordedAudioUri] = useState(null);
  const handleStartRecording = () => {
    setIsRecording(true);
  }

  const handleStopRecording = (uri) => {
    setIsRecording(false)
    setRecordedAudioUri(uri)
  }

  const renderSelfTripContent = () => {
    <>
      {renderCommonContent()}
      <View style={styles.sectionContainer}>
        <CustomInput
          placeholder={'Type your message'}
          value={message}
          onChangeText={setMessage}
          multiline={true}
          rightItem={
            !recordedAudioUri && (
              <TouchableOpacity onPress={handleStartRecording}>
                <MicIcon fill={isRecording ? 'red' : 'black'} />
              </TouchableOpacity>
            )
          }
        />


      </View>
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

        <View style={styles.buttonContainer}>
          <CustomButton
            title={'startTrip'}
            style={styles.submitButton}
            onPress={() => {

            }}
          />
          <CustomButton
            title={'cancel'}
            variant="text"
            style={styles.cancelButton}
            onPress={() => {
              // Handle cancel action
            }}
          />

        </View>
        <View style={{ marginBottom: 40 }} />
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
