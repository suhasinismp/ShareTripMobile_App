import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../../components/ui/CustomTextInput';
import { signupScheme } from '../../constants/schema/signupScheme';
import { inputFieldNames } from '../../constants/strings/inputFieldNames';
import { i18n } from '../../constants/lang/index';
import CustomButton from '../../components/ui/CustomButton';
import { useTheme } from '../../hooks/useTheme';

const inputFields = [
  { name: inputFieldNames.FULL_NAME, placeholder: i18n.t('SIGNUP_FULL_NAME') },
  {
    name: inputFieldNames.PHONE_NUMBER,
    placeholder: i18n.t('SIGNUP_PHONE_NUMBER'),
  },
  {
    name: inputFieldNames.DRIVERS_BUSINESS_DETAILS,
    placeholder: i18n.t('SIGNUP_DRIVERS_BUSINESS_DETAILS'),
  },
  { name: inputFieldNames.EMAIL, placeholder: i18n.t('SIGNUP_EMAIL_ID') },
  {
    name: inputFieldNames.EMERGENCY_NUMBER_ONE,
    placeholder: i18n.t('SIGNUP_EMERGENCY_NUMBER_ONE'),
  },
  {
    name: inputFieldNames.EMERGENCY_NUMBER_TWO,
    placeholder: i18n.t('SIGNUP_EMERGENCY_NUMBER_TWO'),
  },
  {
    name: inputFieldNames.PASSWORD,
    placeholder: i18n.t('SIGNUP_PASSWORD'),
    secureTextEntry: true,
  },
  {
    name: inputFieldNames.CONFIRM_PASSWORD,
    placeholder: i18n.t('SIGNUP_CONFIRM_PASSWORD'),
    secureTextEntry: true,
  },
];

const SignUpScreen = () => {
  const { theme } = useTheme();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(signupScheme),
  });

  const submit = (data) => {
    console.log(data);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        ([styles.contentContainer],
        {
          backgroundColor: theme.backgroundColor,
        })
      }
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {inputFields.map((item) => (
            <CustomTextInput
              key={item.name}
              control={control}
              name={item.name}
              placeholder={item.placeholder}
              secureTextEntry={item.secureTextEntry}
            />
          ))}
          <View style={styles.buttonContainer}>
            <CustomButton
              title={i18n.t('SIGNUP_BUTTON')}
              onPress={handleSubmit(submit)}
            />
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
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    rowGap: 15,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default SignUpScreen;
