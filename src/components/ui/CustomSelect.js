import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
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
  icon,
  children,
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
              borderColor: theme.primaryColor,
              ...unselectedStyle,
            },
      ]}
      onPress={onPress}
    >
      <View style={styles.contentContainer}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        {children && <View style={styles.childrenContainer}>{children}</View>}
        <CustomText
          text={text}
          variant={'captionTextActive'}
          style={[
            styles.text,
            textStyle,
            isSelected && { color: theme.white, ...selectedTextStyle },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  select: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    minHeight: 34,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 5,
  },
  childrenContainer: {
    marginBottom: 5,
  },
  text: {
    textAlign: 'center',
  },
});

export default CustomSelect;
