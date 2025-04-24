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
    icon = <ErrorIcon style={styles.icon} />;
    borderColor = '#D83435';
  } else if (type === 'success') {
    bgColor = '#E4F0E7';
    icon = <SuccessIcon style={styles.icon} />;
    borderColor = '#1F833F';
  } else {
    bgColor = '#727374';
    icon = <WarningIcon style={styles.icon} />;
  }

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => {
        dispatch(hideSnackbar());
      }, 5000);

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
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.contentContainer}>
        <Text style={styles.messageText}>{message}</Text>
        {actionText && (
          <TouchableOpacity onPress={() => dispatch(hideSnackbar())}>
            <Text style={styles.actionText}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
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
    left: 16,
    right: 16,
    borderLeftWidth: 4,
    maxWidth: '90%',
    alignSelf: 'center',
  },
  topContainer: {
    top: 15,
  },
  bottomContainer: {
    bottom: 80,
  },
  iconContainer: {
    marginRight: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#191919',
    flexShrink: 1,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#005680',
    fontWeight: 'bold',
  },
});

export default CustomSnackbar;
