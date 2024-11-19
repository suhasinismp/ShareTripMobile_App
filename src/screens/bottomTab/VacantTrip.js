import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import AppHeader from '../../components/AppHeader';
import AddPostIcon from '../../../assets/svgs/addPost.svg';
import CustomModal from '../../components/ui/CustomModal';
import CustomInput from '../../components/ui/CustomInput';
import MicIcon from '../../../assets/svgs/mic.svg';
import CustomButton from '../../components/ui/CustomButton';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import { createVacantPost } from '../../services/vacantService';
import { getAllVehiclesByUserId } from '../../services/vehicleDetailsService';

const { width } = Dimensions.get('window');

const VacantTripModal = ({
  typeMessage,
  setTypeMessage,
  voiceMessage,
  setVoiceMessage,
  handleStartVacantModal,
  handleCancelVacantModal,
  isRecording,
  recordedAudioUri,
  handleStartRecording,
  handleStopRecording,
  handleDeleteRecording,
  handlePostVacantTrip,

}) => {

  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Post Vacant Trip</Text>
      <Text style={styles.modalTitlee}>Type your Message or record Voice</Text>
      <View style={styles.inputGroup}>
        <CustomInput
          placeholder="Type your message"
          value={typeMessage}
          onChangeText={setTypeMessage}
          multiline={true}
          rightItem={
            !recordedAudioUri && (
              <TouchableOpacity onPress={handleStartRecording}>
                <MicIcon fill={isRecording ? 'red' : 'black'} />
              </TouchableOpacity>
            )
          }
        />
        {(isRecording || recordedAudioUri) && (
          <AudioContainer
            isRecording={isRecording}
            recordedAudioUri={recordedAudioUri}
            onRecordingComplete={handleStopRecording}
            onDelete={handleDeleteRecording}
          />
        )}
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={handleStartVacantModal}>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="post Vacant Trip"
          style={styles.submitButton}
          onPress={handlePostVacantTrip}
        />
        <CustomButton
          title="Cancel"
          variant="text"
          style={styles.cancelButton}
          onPress={handleCancelVacantModal}
        />

      </View>
    </View >
  );
}

const VacantTrip = () => {
  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;
  const userId = userData.userId;
  const [isModalVisible, setModalVisible] = useState(false);
  const [typeMessage, setTypeMessage] = useState('');
  const [voiceMessage, setVoiceMessage] = useState('');
  const [showVacantTripModal, setShowVacantTripModal] = useState('');
  const [recordedAudioUri, setRecordedAudioUri] = useState(null);
  const [postedUserId, setPostedUserId] = useState(null)
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [userVehicles, setUserVehicles] = useState([]);

  useEffect(() => {
    if (showVacantTripModal) {
      setModalVisible(true);
    }
  }, [showVacantTripModal])

  useEffect(() => {
    getUserVehicles()
  }, [userId])

  const handleAddPost = () => {
    setShowVacantTripModal(true)
  }

  const handleStartVacantModal = () => {
    setShowVacantTripModal(true)
  }
  const handleCancelVacantModal = () => {

    setShowVacantTripModal(false);
  };

  const handleStartRecording = () => {
    setIsRecording(true)
  }
  const handleStopRecording = (uri) => {
    setIsRecording(false);
    setRecordedAudioUri(uri);
  };
  const handleDeleteRecording = () => {
    setRecordedAudioUri(null);
  };


  const getUserVehicles = async () => {
    const response = await getAllVehiclesByUserId(userToken, userId);

    setUserVehicles(response.data);
  };
  const handlePostVacantTrip = async () => {
    let isValid = true;
    let errorMessage = '';
    if (typeMessage.length === 0 && !recordedAudioUri) {
      isValid = false;
      errorMessage = 'Please enter a message or record an audio';
    }
    if (!isValid) {
      alert(errorMessage);
      return;
    }

    let finalData = {
      posted_user_id: userId,
      vehicle_type_id: userVehicles[0]?.vehicles?.vehicle_types_id,
      vehicle_name_id: userVehicles[0]?.vehicles?.vehicle_names_id,
      vacant_post_comments: typeMessage,
    };
    console.log('rrr', finalData)
    let formData = new FormData();
    formData.append('json', JSON.stringify(finalData));

    if (recordedAudioUri) {
      const filename = recordedAudioUri.split('/').pop();

      formData.append('voiceMessage', {
        uri: recordedAudioUri,
        type: 'audio/m4a',
        name: filename,
      });
    }
    const response = await createVacantPost(formData, userToken)
    console.log({ response })
    if (response.error === false) {
      alert('Vacant post created successfully');
      handleCancelVacantModal();
    } else {
      alert(response.message);
    }
  }



  return (
    <>
      <AppHeader
        drawerIcon={true}
        groupIcon={true}
        onlineIcon={true}
        muteIcon={true}

      />
      <TouchableOpacity style={styles.floatingButton} onPress={handleAddPost}>
        <AddPostIcon />
      </TouchableOpacity>

      <CustomModal
        visible={showVacantTripModal}
        onPrimaryAction={handleStartVacantModal}
        onSecondaryAction={handleCancelVacantModal}
      >
        <VacantTripModal
          typeMessage={typeMessage}
          setTypeMessage={setTypeMessage}
          voiceMessage={voiceMessage}
          setVoiceMessage={setVoiceMessage}
          handleStartVacantModal={handleStartVacantModal}
          handleCancelVacantModal={handleCancelVacantModal}
          handlePostVacantTrip={handlePostVacantTrip}
        />

      </CustomModal>

    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    padding: 10,
    marginTop: 30,
  },
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  modalTitlee: {
    fontSize: 14,


    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#005680',
    borderRadius: 4,
    width: width * 0.4,
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  submitButton: {
    width: width * 0.4,
    alignItems: 'center',
    backgroundColor: '#123F67',
    borderRadius: 4,
  },


});

export default VacantTrip;


