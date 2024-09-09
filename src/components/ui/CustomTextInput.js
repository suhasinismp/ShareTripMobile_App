import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import CustomText from './CustomText';
import { Controller } from 'react-hook-form';

const CustomTextInput = ({
  placeholder,
  rightItem,
  height = 56,
  control,
  name,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value = '', onChange }, fieldState: { error } }) => (
        <Pressable onPress={handleFocus}>
          <CustomText
            variant="placeHolderText"
            style={[
              styles.label,
              { backgroundColor: theme.backgroundColor },
              {
                top:
                  isFocused === false && value.length === 0
                    ? height / 2 - 11
                    : -9,
              },
              (isFocused || value !== '') && styles.labelRaised,
              isFocused && styles.labelFocused,
            ]}
            text={placeholder}
          />

          <View
            style={[
              styles.inputContainer,
              { height: height },
              { backgroundColor: theme.backgroundColor },
            ]}
          >
            <TextInput
              ref={inputRef}
              style={[styles.input, isFocused && styles.inputFocused]}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChangeText={onChange}
              value={value}
              {...props}
            />
            {rightItem && (
              <View style={styles.rightItemContainer}>{rightItem}</View>
            )}
          </View>

          {error && (
            <CustomText
              text={error.message}
              style={{ color: 'red', marginTop: 4, marginLeft: 4 }}
            />
          )}
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },

  label: {
    position: 'absolute',
    left: 12,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  labelRaised: {
    fontSize: 12,
  },
  labelFocused: {
    color: '#6750A4',
  },
  rightItemContainer: {
    paddingHorizontal: 12,
  },
});

export default CustomTextInput;
