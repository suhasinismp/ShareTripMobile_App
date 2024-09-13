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
import { fieldNames } from '../../constants/strings/fieldNames';
import { i18n } from '../../constants/lang/index';
import CustomButton from '../../components/ui/CustomButton';
import { useTheme } from '../../hooks/useTheme';
import CustomText from '../../components/ui/CustomText';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from '../../services/RegistrationService';

const inputFields = [
  {
    name: fieldNames.FULL_NAME,
    placeholder: i18n.t('SIGNUP_FULL_NAME'),
    keyboardType: 'default',
  },
  {
    name: fieldNames.PHONE_NUMBER,
    placeholder: i18n.t('SIGNUP_PHONE_NUMBER'),
    keyboardType: 'numeric',
  },
  {
    name: fieldNames.EMAIL,
    placeholder: i18n.t('SIGNUP_EMAIL_ID'),
    keyboardType: 'email-address',
  },
  {
    name: fieldNames.EMERGENCY_NUMBER_ONE,
    placeholder: i18n.t('SIGNUP_EMERGENCY_NUMBER_ONE'),
    keyboardType: 'numeric',
  },
  {
    name: fieldNames.EMERGENCY_NUMBER_TWO,
    placeholder: i18n.t('SIGNUP_EMERGENCY_NUMBER_TWO'),
    keyboardType: 'numeric',
  },
  {
    name: fieldNames.PASSWORD,
    placeholder: i18n.t('SIGNUP_PASSWORD'),
    secureTextEntry: true,
    keyboardType: 'default',
  },
  {
    name: fieldNames.CONFIRM_PASSWORD,
    placeholder: i18n.t('SIGNUP_CONFIRM_PASSWORD'),
    secureTextEntry: true,
    keyboardType: 'default',
  },
];

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupScheme),
  });

  const submit = async (data) => {
    console.log(data);
    let finalData = {
      u_name: data[fieldNames.FULL_NAME],
      u_mob_num: data[fieldNames.PHONE_NUMBER].toString(),
      u_email_id: data[fieldNames.EMAIL],
      u_emergency_num1: data[fieldNames.EMERGENCY_NUMBER_ONE].toString(),
      u_emergency_num2: data[fieldNames.EMERGENCY_NUMBER_TWO].toString(),
      u_pswd: data[fieldNames.PASSWORD],
    };
    const response = await registerUser(finalData);
    if (response?.message == 'Registered Successfully') {
      navigation.navigate('OTPVerify', {
        userId: response.data[0].id,
        phoneNumber: response.data[0].u_mob_num,
      });
    }
  };

  console.log('Form errors:', errors);

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.contentContainer,
        {
          backgroundColor: theme.backgroundColor,
        },
      ]}
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
              keyboardType={item.keyboardType}
            />
          ))}
          <View style={styles.buttonContainer}>
            <CustomButton
              title={i18n.t('SIGNUP_BUTTON')}
              onPress={handleSubmit(submit)}
            />
          </View>
          <View style={styles.captionContainer}>
            <CustomText
              text={i18n.t('SIGN_IN_ALREADY_HAVE_ACCOUNT')}
              variant="captionText"
            />
            <CustomButton
              title={i18n.t('SIGN_IN_TITLE')}
              onPress={() => {
                Keyboard.dismiss();
                navigation.navigate('SignIn');
              }}
              variant="text"
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
  captionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignUpScreen;
