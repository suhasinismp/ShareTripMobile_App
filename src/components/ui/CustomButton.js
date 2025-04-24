import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import CustomText from './CustomText';

const CustomButton = ({
  onPress,
  title,
  style,
  textStyle,
  variant = 'primary', // 'primary', 'secondary', 'text', 'disabled', 'disabledText'
  disabled = false,
}) => {
  const { theme } = useTheme();

  const isDisabled = disabled || variant.includes('disabled');

  const getButtonStyles = () => {
    switch (variant) {
      case 'text':
      case 'disabledText':
        return [
          styles.textButton,
          isDisabled ? { color: theme.disabledColor } : {},
          style,
        ];
      case 'secondary':
        return [
          styles.button,
          {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.primaryColor,
          },
          style,
        ];
      case 'primary':
      case 'disabled':
      default:
        return [
          styles.button,
          {
            backgroundColor: isDisabled
              ? theme.disabledColor
              : theme.primaryColor,
          },
          style,
        ];
    }
  };

  const getTextStyles = () => {
    if (variant === 'text' || variant === 'disabledText') {
      return [
        styles.text,
        { color: isDisabled ? theme.disabledColor : theme.primaryColor },
        textStyle,
      ];
    }
    if (variant === 'secondary') {
      return [
        styles.text,
        { color: isDisabled ? theme.disabledColor : theme.primaryColor },
        textStyle,
      ];
    }
    return [styles.text, { color: 'white' }, textStyle];
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  textButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});

export default CustomButton;
