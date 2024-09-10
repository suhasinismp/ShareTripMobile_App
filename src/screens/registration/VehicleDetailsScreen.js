import React from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { inputFieldNames } from '../../constants/strings/inputFieldNames';
import { i18n } from '../../constants/lang';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../../components/ui/CustomTextInput';
import CustomButton from '../../components/ui/CustomButton';

const inputFields = [
  {
    id: 1,
    name: inputFieldNames.FULL_NAME,
    placeholder: i18n.t('VEHICLE_NAME'),
  },
  {
    id: 2,
    name: inputFieldNames.FULL_NAME,
    placeholder: i18n.t('VEHICLE_TYPE'),
  },

  {
    id: 3,
    name: inputFieldNames.FULL_NAME,
    placeholder: i18n.t('VEHICLE_MODEL'),
  },
  {
    id: 4,
    name: inputFieldNames.FULL_NAME,
    placeholder: i18n.t('VEHICLE_REGISTRATION_NUMBER'),
  },
  {
    id: 5,
    name: inputFieldNames.FULL_NAME,
    placeholder: i18n.t('VEHICLE_SEATING_CAPACITY'),
  },
];
const VehicleDetailsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(),
  });

  const onSubmit = (data) => {
    // console.log('Form data:', data);
    navigation.navigate('BusinessDetails');
  };

  return (
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {inputFields.map((item) => (
            <CustomTextInput
              key={item.id}
              control={control}
              name={item.name}
              placeholder={item.placeholder}
              secureTextEntry={item.secureTextEntry}
            />
          ))}
          <View style={styles.buttonContainer}>
            <CustomButton
              title={i18n.t('SKIP')}
              onPress={() => {}}
              variant="text"
            />
            {/* <CustomButton
              title={i18n.t('SIGNUP_BUTTON')}
              onPress={handleSubmit(onSubmit)}
            /> */}
            <CustomButton title={i18n.t('SIGNUP_BUTTON')} onPress={onSubmit} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  innerContainer: {
    marginTop: 22,
    rowGap: 15,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default VehicleDetailsScreen;
