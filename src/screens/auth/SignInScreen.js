import React from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AppLogo from '../../../assets/svgs/shareTripLogo.svg';
import { fieldNames } from '../../constants/strings/fieldNames';
import { i18n } from '../../constants/lang';
import CustomTextInput from '../../components/ui/CustomTextInput';
import CustomButton from '../../components/ui/CustomButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useTheme } from '../../hooks/useTheme';
import { signInScheme } from '../../constants/schema/loginScheme';
import CustomText from '../../components/ui/CustomText';
import { useNavigation } from '@react-navigation/native';

const inputFields = [
  {
    name: fieldNames.EMAIL_OR_PHONE,
    placeholder: i18n.t('SIGN_IN_EMAIL_OR_PHONE'),
  },
  {
    name: fieldNames.PASSWORD,
    placeholder: i18n.t('SIGN_IN_PASSWORD'),
    secureTextEntry: true,
  },
];

const SignInScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(signInScheme),
  });

  const onSubmit = (data) => {
    // console.log('Form data:', data);
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
      <AppLogo style={{ alignSelf: 'center' }} />

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
              title={i18n.t('SIGN_IN_BUTTON')}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
          <View style={styles.captionContainer}>
            <CustomText
              text={i18n.t('SIGNUP_DONT_HAVE_ACCOUNT')}
              variant="captionText"
            />
            <CustomButton
              title={i18n.t('SIGNUP_TITLE')}
              onPress={() => {
                Keyboard.dismiss();
                navigation.navigate('UserType');
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
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    marginTop: 22,
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

export default SignInScreen;
