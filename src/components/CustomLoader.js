import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const CustomLoader = ({ size, color, style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

CustomLoader.propTypes = {
  size: PropTypes.oneOf(['small', 'large']),
  color: PropTypes.string,
  style: PropTypes.object,
};

CustomLoader.defaultProps = {
  size: 'large',
  color: '#0000ff',
  style: {},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomLoader;
