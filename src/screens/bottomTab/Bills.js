import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';

const Bills = () => {
  return (
    <>
      <AppHeader
        drawerIcon={true}
        groupIcon={true}
        onlineIcon={true}
        muteIcon={true}
        search={true}
      />
      <Text style={{ textAlign: 'center', color: 'red', marginTop: 150, fontSize: 30 }}>Coming soon........</Text>
    </>
  );
};

const styles = StyleSheet.create({});

export default Bills;
