
import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import AddPostIcon from '../../../assets/svgs/addPost.svg';
import CustomModal from '../../components/ui/CustomModal';
import CustomInput from '../../components/ui/CustomInput';
import MicIcon from '../../../assets/svgs/mic.svg';
import CustomButton from '../../components/ui/CustomButton';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import { createVacantPost, getVacantPost } from '../../services/vacantService';
import { getAllVehiclesByUserId } from '../../services/vehicleDetailsService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PostCard from '../../components/PostCard';
import { formatDate } from '../../utils/formatdateUtil';
import AudioContainer from '../../components/AudioContainer';

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

      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleStartVacantModal}
      ></TouchableOpacity>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Cancel"
          variant="text"
          style={styles.cancelButton}
          onPress={handleCancelVacantModal}
        />
        <CustomButton
          title="post Vacant Trip"
          style={styles.submitButton}
          onPress={handlePostVacantTrip}
        />
      </View>
    </View>
  );
};

const VacantTrip = () => {
  const navigation = useNavigation();
  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;
  const userId = userData.userId;
  const [isModalVisible, setModalVisible] = useState(false);
  const [typeMessage, setTypeMessage] = useState('');
  const [voiceMessage, setVoiceMessage] = useState('');
  const [showVacantTripModal, setShowVacantTripModal] = useState('');
  const [recordedAudioUri, setRecordedAudioUri] = useState(null);
  const [postedUserId, setPostedUserId] = useState(null);
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [userVehicles, setUserVehicles] = useState([]);
  const [userVacantPostData, setUserVacantPostData] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getUserVacantPosts();
    }, [userId, userToken]),
  );

  useEffect(() => {
    if (showVacantTripModal) {
      setModalVisible(true);
    }
  }, [showVacantTripModal]);

  useEffect(() => {
    getUserVehicles();
  }, [userId]);

  const getUserVacantPosts = async () => {
    const response = await getVacantPost(userToken);
    if (response?.error === false) {
      setUserVacantPostData(response.data);
    }
  };

  const handleAddPost = () => {
    setShowVacantTripModal(true);
  };

  const handleStartVacantModal = () => {
    setShowVacantTripModal(true);
  };

  const handleCancelVacantModal = () => {
    setShowVacantTripModal(false);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };
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
      vehicle_names_id: userVehicles[0]?.vehicles?.vehicle_names_id,
      vacant_post_comments: typeMessage,
    };

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
    const response = await createVacantPost(formData, userToken);

    if (response.error === false) {
      alert('Vacant post created successfully');
      setTypeMessage('');
      setRecordedAudioUri(null);
      setIsRecording(false);
      setShowVacantTripModal(false);
      handleCancelVacantModal();
    } else {
      alert(response.message);
    }
  };
  const renderVacantPostCard = ({ item }) => (
    <PostCard
      // Card Header Props
      // bookingType={item?.bookingType_name}
      // createdAt={formatDate(item?.created_at)}
      // postStatus={item?.post_status}

      userProfilePic={item?.user_profile || 'https://via.placeholder.com/150'}
      userName={item?.user_name}
      // Trip Details Props
      // pickUpTime={item?.pick_up_time}
      // fromDate={item?.from_date}
      vehicleType={item?.vehicle_type}
      vehicleName={item?.vehicle_name}
      // pickUpLocation={item?.pick_up_location}
      // destination={item?.destination}
      vacantTripPostedByLoggedInUser={
        item?.posted_user_id === userId ? true : false
      }
      // Comment/Voice Props
      postComments={item?.vacant_post_comments}
      postVoiceMessage={item?.vacant_post_voice_message}
      // Amount Props
      // baseFareRate={item?.bookingTypeTariff_base_fare_rate}

      // Action Props

      onPlayPress={() => {
        /* TODO: Implement voice message playback */
      }}
      onTripSheetPress={() => {
        navigation.navigate('ViewTripSheet', {
          from: 'myTrips',
          postId: item?.post_booking_id,
        });
      }}
      onMessagePress={() => {
        /* TODO: Implement messaging */
      }}
      isRequested={item?.request_status}
      packageName={item?.bookingTypePackage_name}
    />
  );

  return (
    <>
      <AppHeader
        drawerIcon={true}
        groupIcon={true}
        onlineIcon={true}
        muteIcon={true}
        search={true}
      />
      <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>Vacant Trips</Text>


      <FlatList
        data={userVacantPostData} // Ensure this is defined or passed as a prop
        renderItem={renderVacantPostCard} // Ensure this function is defined
        keyExtractor={(item) => item?.vacant_post_id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}

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
          isRecording={isRecording}
          recordedAudioUri={recordedAudioUri}
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
          handleDeleteRecording={handleDeleteRecording}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    width: width * 0.2,
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  submitButton: {
    width: width * 0.4,
    alignItems: 'right',
    backgroundColor: '#123F67',
    borderRadius: 4,
  },
  listContainer: {
    // flex: 1,
    // marginHorizontal: 20,
    flexGrow: 1,
    // borderRadius: 4,
  },
});

export default VacantTrip;
