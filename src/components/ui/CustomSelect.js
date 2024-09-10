import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from './CustomText';
import { useTheme } from '../../hooks/useTheme';

const CustomSelect = ({
  text,
  isSelected,
  onPress,
  containerStyle,
  selectedStyle,
  unselectedStyle,
  textStyle,
  selectedTextStyle,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.select,
        containerStyle,
        isSelected
          ? { backgroundColor: theme.primaryColor, ...selectedStyle }
          : {
              backgroundColor: theme.backgroundColor,
              borderColor: theme.borderColor,
              ...unselectedStyle,
            },
      ]}
      onPress={onPress}
    >
      <CustomText
        text={text}
        variant={'captionTextActive'}
        style={[
          textStyle,
          isSelected && { color: theme.white, ...selectedTextStyle },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  select: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
});

export default CustomSelect;
