import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ErrorIcon from '../../../assets/svgs/error.svg';
import SuccessIcon from '../../../assets/svgs/success.svg';
import WarningIcon from '../../../assets/svgs/warning.svg';
import { hideSnackbar } from '../../store/slices/snackBarSlice';
import { snackBarConfigSelector } from '../../store/selectors';

const CustomSnackbar = () => {
  const dispatch = useDispatch();
  const { visible, message, actionText, position, type } = useSelector(
    snackBarConfigSelector,
  );
  let bgColor;
  let icon;
  let borderColor;
  if (type === 'error') {
    bgColor = '#FBE5E6';
    icon = <ErrorIcon style={{ width: 30, height: 30 }} />;
    borderColor = '#D83435';
  } else if (type === 'success') {
    bgColor = '#E4F0E7';
    icon = <SuccessIcon style={{ width: 30, height: 30 }} />;
    borderColor = '#1F833F';
  } else {
    bgColor = '#727374';
    icon = <WarningIcon style={{ width: 30, height: 30 }} />;
  }

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => {
        dispatch(hideSnackbar());
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const containerStyle =
    position === 'top' ? styles.topContainer : styles.bottomContainer;

  return visible ? (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor, borderColor: borderColor },
        containerStyle,
      ]}
    >
      {icon}
      <Text style={styles.messageText}>{message}</Text>
      {actionText && (
        <TouchableOpacity onPress={() => dispatch(hideSnackbar())}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    marginHorizontal: 15,
    borderLeftWidth: 4,
  },
  topContainer: {
    top: 15,
  },
  bottomContainer: {
    bottom: 80,
  },
  messageText: {
    fontSize: 16,
    color: '#191919',
    marginLeft: 40,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: 'white',
  },
});

export default CustomSnackbar;
