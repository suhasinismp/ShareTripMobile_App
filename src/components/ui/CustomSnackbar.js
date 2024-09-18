import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';



import { hideSnackbar } from '../../store/slices/snackBarSlice';
import { snackBarConfigSelector } from '../../store/selectors';
import { colors } from '../../styles/globalStyles';

const CustomSnackbar = () => {
  const dispatch = useDispatch();
  const { visible, message, actionText, position, type } = useSelector(
    snackBarConfigSelector,
  );

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
    <View style={[styles.container, containerStyle]}>
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
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
    marginHorizontal: 15,
    backgroundColor: 'red',
  },
  topContainer: {
    top: 15,
  },
  bottomContainer: {
    bottom: 80,
  },
  messageText: {
    fontSize: 16,
    color: 'white',
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'white',
  },
});

export default CustomSnackbar;
