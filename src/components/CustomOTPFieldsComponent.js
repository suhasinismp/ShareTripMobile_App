import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const CustomOTPFields = ({ onChangeOTP }) => {
  const { theme } = useTheme();

  const noOfFields = 4;
  const [otp, setOtp] = useState(Array(noOfFields).fill(''));
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (/^[0-9]?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to the next input if available
      if (text && index < noOfFields - 1) {
        inputs.current[index + 1].focus();
      }

      // Callback to pass OTP to parent component
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

      // Callback to pass OTP to parent component
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

  const renderItem = ({ item, index }) => (
    <TextInput
      key={index}
      ref={(ref) => (inputs.current[index] = ref)}
      style={[styles.input, { backgroundColor: theme.inputBackgroundColor }]}
      keyboardType="numeric"
      maxLength={1}
      value={otp[index]}
      onChangeText={(text) => handleChange(text, index)}
      onKeyPress={(e) => handleKeyPress(e, index)}
      onFocus={() => handleFocus(index)}
      cursorColor={theme.primaryColor}
      autoFocus={index === 0}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={otp}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ alignSelf: 'center' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 32,
  },
  input: {
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    marginHorizontal: 5,
    width: 50,
    height: 50,
    elevation: 4,
  },
});

export default CustomOTPFields;
