import React from 'react';
import { StyleSheet } from 'react-native';
import AppHeader from '../../components/AppHeader';

const AddGroupMembers = ({ route }) => {
  const { groupId } = route.params;
  return (
    <>
      <AppHeader backIcon={true} title={'Add Group Members'} />
    </>
  );
};

const styles = StyleSheet.create({});

export default AddGroupMembers;
