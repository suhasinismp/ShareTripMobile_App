import React, { useRef, useState, useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import CustomText from './CustomText';
import { Ionicons } from '@expo/vector-icons';

const CustomInput = ({
  placeholder,
  rightItem,
  height = 56,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
  multiline = false,
  error,
  editable = true, // Add default value
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const [inputHeight, setInputHeight] = useState(height);
  const inputRef = useRef(null);

  const handleFocus = () => {
    if (editable) {
      setIsFocused(true);
      inputRef.current?.focus();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleContentSizeChange = useCallback(
    (event) => {
      if (multiline) {
        const { height } = event.nativeEvent.contentSize;
        setInputHeight(Math.max(height, 56));
      }
    },
    [multiline],
  );

  const renderEyeIcon = () => (
    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
      <Ionicons
        name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
        size={24}
        color={theme.textColor}
      />
    </TouchableOpacity>
  );

  return (
    <Pressable onPress={handleFocus} disabled={!editable}>
      <CustomText
        variant="placeHolderText"
        style={[
          styles.label,
          { backgroundColor: theme.backgroundColor },
          {
            top:
              isFocused === false && (!value || value.length === 0)
                ? multiline
                  ? 16
                  : inputHeight / 2 - 11
                : -9,
          },
          (isFocused || (value && value !== '')) && styles.labelRaised,
          isFocused && styles.labelFocused,
          !editable && styles.disabled,
        ]}
        text={placeholder}
      />

      <View
        style={[
          styles.inputContainer,
          { minHeight: inputHeight },
          { backgroundColor: theme.backgroundColor },
          !editable && styles.disabledContainer,
        ]}
      >
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            multiline && styles.multilineInput,
            { height: multiline ? inputHeight : 'auto' },
            !editable && styles.disabledText,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          value={value}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          onContentSizeChange={handleContentSizeChange}
          editable={editable}
          {...props}
        />
        {secureTextEntry && renderEyeIcon()}
        {rightItem && (
          <View style={styles.rightItemContainer}>
            {typeof rightItem === 'function' ? rightItem() : rightItem}
          </View>
        )}
      </View>

      {error && (
        <CustomText
          text={error}
          style={{ color: 'red', marginTop: 4, marginLeft: 4 }}
        />
      )}
    </Pressable>
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
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 12,
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
    paddingLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    padding: 8,
  },
  disabled: {
    color: '#9E9E9E',
  },
  disabledContainer: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  disabledText: {
    color: '#9E9E9E',
  },
});

export default CustomInput;
