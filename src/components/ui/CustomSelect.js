import React from 'react';
import { StyleSheet, TouchableOpacity, View} from 'react-native';
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
      <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
        {icon? icon:null}
       
      <CustomText
        text={text}
        variant={'captionTextActive'}
        style={[
          { flex:1,textAlign:'center'},
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
    minHeight: 80,

    
   
    elevation: 2,
  },
});

export default CustomSelect;
