import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, AppState, Keyboard } from 'react-native';
import CustomOTPFields from '../../components/CustomOTPFieldsComponent';
import CustomText from '../../components/ui/CustomText';
import CustomButton from '../../components/ui/CustomButton';
import { i18n } from '../../constants/lang';
import { useNavigation } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../store/slices/snackBarSlice';
import { verifyOTP } from '../../services/registrationService';

const OTPVerifyScreen = ({ route }) => {
  const { phoneNumber } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const appState = useRef(AppState.currentState);
  const timerRef = useRef(null);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    startTimer();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground
        const elapsedTime = Math.floor((Date.now() - timerRef.current) / 1000);
        setTimer((prevTimer) => Math.max(0, prevTimer - elapsedTime));
      } else if (nextAppState.match(/inactive|background/)) {
        // App has gone to the background
        timerRef.current = Date.now();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
    }
  }, [timer]);

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleResend = () => {
    if (canResend) {
      setTimer(60);
      setCanResend(false);
      startTimer();
    }
  };

  const validateOTP = async () => {
    const finalData = {
      u_mob_num: phoneNumber,
      otp_numb: otp,
    };
    const response = await verifyOTP(finalData);
    console.log('response', response);
    if (response?.message == 'OTP Matched!') {
      navigation.navigate('Register', {
        screen: 'SubscriptionPlans',
      });
    } else {
      dispatch(
        showSnackbar({
          visible: true,
          message: 'Invalid OTP',
          type: 'Error',
        }),
      );
    }
  };

  return (
    <View style={styles.container}>
      <CustomOTPFields onChangeOTP={setOtp} />
      <CustomText
        variant="captionText"
        text={`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
        style={{ textAlign: 'center' }}
      />
      <View style={styles.captionContainer}>
        <CustomText text={i18n.t('OTP_VERIFY_DIDNT_RECEIVE')} />
        <CustomButton
          title={i18n.t('OTP_VERIFY_SEND_AGAIN')}
          variant="text"
          onPress={handleResend}
        />
      </View>
      <CustomButton title={i18n.t('OTP_VERIFY_BUTTON')} onPress={validateOTP} />
      <View style={styles.captionContainer}>
        <CustomText
          text={i18n.t('OTP_VERIFY_ENTERED_WRONG_NUMBER')}
          variant="captionText"
        />
        <CustomButton
          title={i18n.t('OTP_VERIFY_GO_BACK')}
          onPress={() => {
            Keyboard.dismiss();
            navigation.goBack();
          }}
          variant="text"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    rowGap: 20,
  },
  captionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
});

export default OTPVerifyScreen;
