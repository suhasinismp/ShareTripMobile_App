import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const CustomOTPFields = ({ onChangeOTP }) => {
  const { theme } = useTheme();

  const noOfFields = 6;
  const [otp, setOtp] = useState(Array(noOfFields).fill(''));
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (/^[0-9]?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < noOfFields - 1) {
        inputs.current[index + 1].focus();
      }

      if (onChangeOTP) {
        onChangeOTP(newOtp.join(''));
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
      } else if (index > 0) {
        newOtp[index - 1] = '';
        inputs.current[index - 1].focus();
      }
      setOtp(newOtp);

      if (onChangeOTP) {
        onChangeOTP(newOtp.join(''));
      }
    }
  };

  const handleFocus = (index) => {
    const newOtp = [...otp];
    if (otp[index]) {
      newOtp[index] = '';
    }
    setOtp(newOtp);
  };

  return (
    <View style={styles.container}>
      {otp.map((_, index) => (
        <View key={index} style={styles.inputContainer}>
          <TextInput
            ref={(ref) => (inputs.current[index] = ref)}
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBackgroundColor,
                color: theme.textColor,
              },
            ]}
            keyboardType="numeric"
            maxLength={1}
            value={otp[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            cursorColor={theme.primaryColor}
            autoFocus={index === 0}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 32,
  },
  inputContainer: {
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    width: 50,
    height: 50,
    elevation: 4,
  },
});

export default CustomOTPFields;
