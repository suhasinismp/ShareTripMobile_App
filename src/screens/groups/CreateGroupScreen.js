import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import { useTheme } from '../../hooks/useTheme';
import UploadOptionsModal from '../../components/UploadOptionsModal';
import CustomTextInput from '../../components/ui/CustomTextInput';
import CustomButton from '../../components/ui/CustomButton';
import { fieldNames } from '../../constants/strings/fieldNames';
import { createGroup } from '../../services/groupsService';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import { useNavigation } from '@react-navigation/native';

const inputFields = [
  {
    id: 1,
    name: fieldNames.GROUP_NAME,
    placeholder: 'Enter Group Name',
    fieldType: 'input',
    multiLine: false,
  },
  {
    id: 2,
    name: fieldNames.GROUP_DESCRIPTION,
    placeholder: 'Group Description',
    fieldType: 'input',
    multiLine: true,
  },
];

const CreateGroupScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;
  const [groupLogo, setGroupLogo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { control, handleSubmit, setValue, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const handleLogoUpload = (file) => {
    setGroupLogo(file.uri);
    setModalVisible(false);
  };

  const handleEditLogo = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    // Handle cancel action
    console.log('Cancel pressed');
  };

  const handleCreateGroup = async (data) => {
    console.log({ data });
    let finalData = {
      group_name: data.groupName,
      group_details: data.groupDescription,
    };
    const formData = new FormData();
    formData.append('json', JSON.stringify(finalData));
    console.log({ groupLogo });

    formData.append('logoUpload', {
      uri: groupLogo,
      type: 'image/jpeg',
      name: `group_logo.jpeg`,
    });

    const response = await createGroup(formData, userToken);
    console.log({ response });
    if (response.group_name === data.groupName) {
      navigation.navigate('AddGroupMembers', {
        groupId: response.id,
      });
    }
  };

  const renderField = (item) => {
    return (
      <View key={item.id} style={styles.inputContainer}>
        <CustomTextInput
          control={control}
          name={item.name}
          placeholder={item.placeholder}
          multiline={item.multiLine}
          textAlignVertical={item.multiLine ? 'top' : 'center'}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader backIcon={true} title={'Create Group'} />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          { backgroundColor: theme.backgroundColor },
        ]}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          {groupLogo ? (
            <Image source={{ uri: groupLogo }} style={styles.groupLogo} />
          ) : (
            <View style={[styles.groupLogo, { backgroundColor: '#E0E0E0' }]} />
          )}
          <TouchableOpacity style={styles.editButton} onPress={handleEditLogo}>
            <Ionicons name="camera-outline" size={24} color={theme.textColor} />
          </TouchableOpacity>
        </View>

        {inputFields.map(renderField)}
      </KeyboardAwareScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Cancel"
          onPress={handleCancel}
          variant="secondary"
          style={styles.cancelButton}
        />
        <CustomButton
          title="Add Members"
          onPress={handleSubmit(handleCreateGroup)}
          style={styles.createButton}
        />
      </View>

      <UploadOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectFile={handleLogoUpload}
        camera={true}
        gallery={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  groupLogo: {
    height: 142,
    width: 142,
    borderRadius: 71,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  createButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default CreateGroupScreen;
