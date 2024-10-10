import React from 'react';
import { Text } from 'react-native';

import { createTextStyles } from '../../styles/globalStyles';
import { useTheme } from '../../hooks/useTheme';

const CustomText = ({ variant = 'body', style, text, ...props }) => {
  const { isDarkMode } = useTheme();
  const textStyles = createTextStyles(isDarkMode ? 'dark' : 'light');

  const getStyleForVariant = () => {
    switch (variant) {
      case 'placeHolderText':
        return textStyles.placeHolderText;
      case 'headerTitle':
        return textStyles.headerTitle;
      case 'activeButtonText':
        return textStyles.activeButtonText;
      case 'captionText':
        return textStyles.captionText;
      case 'captionTextActive':
        return textStyles.captionTextActive;
      case 'activeText':
        return textStyles.activeText;
      case 'sectionTitleText':
        return textStyles.sectionTitleText;
      default:
        return textStyles.body;
    }
  };

  return (
    <Text style={[getStyleForVariant(), style]} {...props}>
      {text}
    </Text>
  );
};

export default CustomText;
