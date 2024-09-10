import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import CustomText from './CustomText';

const CustomButton = ({
  onPress,
  title,
  style,
  textStyle,
  variant = 'primary', // 'primary', 'text', 'disabled', 'disabledText'
  disabled = false,
}) => {
  const { theme } = useTheme();

  const isDisabled = variant.includes('disabled');

  const getButtonStyles = () => {
    switch (variant) {
      case 'text':
      case 'disabledText':
        return [
          styles.textButton,
          isDisabled
            ? { color: theme.disabledColor }
            : { color: theme.primaryColor },
        ];
      case 'primary':
      case 'disabled':
      default:
        return [
          styles.button,
          style,
          {
            backgroundColor: isDisabled
              ? theme.disabledColor
              : theme.primaryColor,
          },
        ];
    }
  };

  const getTextStyles = () => {
    if (variant === 'text' || variant === 'disabledText') {
      return [
        styles.text,
        textStyle,
        isDisabled
          ? { color: theme.disabledColor }
          : { color: theme.primaryColor },
      ];
    }
    return [styles.text, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={isDisabled}
    >
      <CustomText
        style={getTextStyles()}
        text={title}
        variant="captionActive"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});

export default CustomButton;
