import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import AppHeader from '../../components/AppHeader';
import CustomSelect from '../../components/ui/CustomSelect';
import CustomText from '../../components/ui/CustomText';
import { getTripTypes } from '../../services/postTripService';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import {
  fetchVehicleNames,
  fetchVehicleTypes,
} from '../../services/vehicleDetailsService';
import CustomTextInput from '../../components/ui/CustomTextInput';
import { useForm } from 'react-hook-form';
import MicIcon from '../../../assets/svgs/mic.svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '../../hooks/useTheme';

const { width } = Dimensions.get('window');

const VehicleTypeButton = ({ item, isSelected, onPress }) => (
  <View style={{ flexDirection: 'column' }}>
    <TouchableOpacity
      style={[styles.vehicleButton, isSelected && styles.selectedVehicleButton]}
      onPress={onPress}
    >
      <Image source={{ uri: item.v_type_pic }} style={styles.vehicleImage} />
    </TouchableOpacity>
    <CustomText text={item.v_type} style={styles.vehicleText} />
  </View>
);

const VehicleNameButton = ({ item, isSelected, onPress }) => (
  <View style={{ flexDirection: 'column' }}>
    <TouchableOpacity
      style={[styles.vehicleButton, isSelected && styles.selectedVehicleButton]}
      onPress={onPress}
    >
      <Image source={{ uri: item.v_pic }} style={styles.vehicleImage} />
    </TouchableOpacity>
    <CustomText text={item.v_name} style={styles.vehicleText} />
  </View>
);

const PostATripScreen = () => {
  const userData = useSelector(getUserDataSelector);
  const userToken = userData.userToken;
  const [postType, setPostType] = useState('Quick Share');
  const [tripTypes, setTripTypes] = useState([]);
  const [selectedTripType, setSelectedTripType] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicleNames, setVehicleNames] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [selectedVehicleName, setSelectedVehicleName] = useState(null);
  const { theme } = useTheme();

  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();
  const [isRecording, setIsRecording] = useState(false);

  const { control } = useForm();

  useEffect(() => {
    fetchConstants();
  }, []);

  useEffect(() => {
    if (tripTypes.length > 0 && !selectedTripType) {
      const localTripType = tripTypes.find(
        (trip) => trip.booking_type_name === 'LOCAL',
      );
      setSelectedTripType(localTripType ? localTripType.id : tripTypes[0].id);
    }
  }, [tripTypes]);

  useEffect(() => {
    if (selectedTripType) {
      const packages = getSelectedTripTypePackages();
      if (packages.length > 0) {
        setSelectedPackage(packages[0].id);
      }
    }
  }, [selectedTripType]);

  useEffect(() => {
    if (vehicleTypes.length > 0 && !selectedVehicleType) {
      setSelectedVehicleType(vehicleTypes[0].id);
    }
  }, [vehicleTypes]);

  useEffect(() => {
    if (selectedVehicleType) {
      const filteredNames = getFilteredVehicleNames();
      if (filteredNames.length > 0) {
        setSelectedVehicleName(filteredNames[0].id);
      }
    }
  }, [selectedVehicleType, vehicleNames]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const fetchConstants = async () => {
    const response = await getTripTypes(userToken);
    if (response.error === false) {
      setTripTypes(response.data);
    }

    const vehicleTypesResponse = await fetchVehicleTypes(userToken);
    if (vehicleTypesResponse.error === false) {
      setVehicleTypes(vehicleTypesResponse.data);
    }

    const vehicleNamesResponse = await fetchVehicleNames(userToken);
    if (vehicleNamesResponse.error === false) {
      setVehicleNames(vehicleNamesResponse.data);
    }
  };

  const renderTripTypeItem = ({ item }) => (
    <CustomSelect
      text={item.booking_type_name}
      containerStyle={styles.tripTypeItem}
      selectedTextStyle={styles.selectedText}
      selectedStyle={styles.selectedBackground}
      isSelected={selectedTripType === item.id}
      onPress={() => {
        setSelectedTripType(item.id);
        setSelectedPackage(null);
      }}
      unselectedStyle={styles.unselectedBorder}
    />
  );

  const renderPackageItem = ({ item }) => (
    <CustomSelect
      text={item.package_name}
      containerStyle={styles.packageItem}
      selectedTextStyle={styles.selectedText}
      selectedStyle={styles.selectedBackground}
      isSelected={selectedPackage === item.id}
      onPress={() => setSelectedPackage(item.id)}
      unselectedStyle={styles.unselectedBorder}
    />
  );

  const renderVehicleTypeItem = ({ item }) => (
    <VehicleTypeButton
      item={item}
      isSelected={selectedVehicleType === item.id}
      onPress={() => {
        setSelectedVehicleType(item.id);
        setSelectedVehicleName(null);
      }}
    />
  );

  const renderVehicleNameItem = ({ item }) => (
    <VehicleNameButton
      item={item}
      isSelected={selectedVehicleName === item.id}
      onPress={() => setSelectedVehicleName(item.id)}
    />
  );

  const getSelectedTripTypePackages = () => {
    const selectedTrip = tripTypes.find((trip) => trip.id === selectedTripType);
    return selectedTrip ? selectedTrip.bookingTypePackageAsBookingType : [];
  };

  const getFilteredVehicleNames = () => {
    return vehicleNames.filter(
      (vehicle) => vehicle.vehicle_types_id === selectedVehicleType,
    );
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setIsRecording(false);

    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
  };

  const playSound = async () => {
    if (sound) {
      await sound.playAsync();
    }
  };

  const handleMicPress = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording]);

  return (
    <>
      <AppHeader
        backIcon={true}
        onlineIcon={true}
        muteIcon={true}
        title={'Post A Trip'}
      />
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          { backgroundColor: theme.backgroundColor },
        ]}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.postTypeContainer}>
          <CustomSelect
            text={'Quick Share'}
            containerStyle={styles.postType}
            selectedTextStyle={styles.selectedText}
            selectedStyle={styles.selectedBackground}
            isSelected={postType === 'Quick Share'}
            onPress={() => setPostType('Quick Share')}
            unselectedStyle={styles.unselectedBorder}
          />
          <CustomSelect
            text={'Trip Sheet'}
            containerStyle={styles.postType}
            selectedTextStyle={styles.selectedText}
            selectedStyle={styles.selectedBackground}
            isSelected={postType === 'Trip Sheet'}
            onPress={() => setPostType('Trip Sheet')}
            unselectedStyle={styles.unselectedBorder}
          />
        </View>
        <View style={styles.sectionContainer}>
          <CustomText
            text={'Select Trip Type :'}
            variant={'sectionTitleText'}
          />
          <FlatList
            data={tripTypes}
            renderItem={renderTripTypeItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContentContainer}
          />
        </View>
        {selectedTripType && (
          <View style={styles.sectionContainer}>
            <CustomText
              text={'Select Package :'}
              variant={'sectionTitleText'}
            />
            <FlatList
              data={getSelectedTripTypePackages()}
              renderItem={renderPackageItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContentContainer}
            />
          </View>
        )}
        <View style={styles.sectionContainer}>
          <CustomText
            text={'Select Vehicle Type :'}
            variant={'sectionTitleText'}
          />
          <FlatList
            data={vehicleTypes}
            renderItem={renderVehicleTypeItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vehicleListContainer}
          />
        </View>
        {selectedVehicleType && (
          <View style={styles.sectionContainer}>
            <CustomText
              text={'Select Vehicle Name :'}
              variant={'sectionTitleText'}
            />
            <FlatList
              data={getFilteredVehicleNames()}
              renderItem={renderVehicleNameItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.vehicleListContainer}
            />
          </View>
        )}

        <CustomTextInput
          control={control}
          name={'typeYourMessage'}
          placeholder={'Type Your Message'}
          multiline={true}
          rightItem={
            <View style={styles.audioContainer}>
              <TouchableOpacity onPress={handleMicPress}>
                <MicIcon fill={isRecording ? 'red' : 'black'} />
              </TouchableOpacity>
              {sound && (
                <TouchableOpacity onPress={playSound} style={styles.playButton}>
                  <CustomText text="Play" />
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  postTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  postType: {
    width: width * 0.4,
    height: 40,
    justifyContent: 'center',
  },
  selectedText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedBackground: {
    backgroundColor: '#008B8B',
  },
  unselectedBorder: {
    borderColor: '#005680',
    borderWidth: 1,
  },
  sectionContainer: {
    marginTop: 16,
  },
  listContentContainer: {
    marginTop: 8,
  },
  tripTypeItem: {
    marginRight: 8,
    paddingHorizontal: 16,
    height: 40,
    justifyContent: 'center',
  },
  selectedTripTypeItem: {
    backgroundColor: '#CCE3F4',
    borderColor: '#008B8B',
    borderWidth: 1,
  },
  packageItem: {
    marginRight: 8,
    paddingHorizontal: 16,
    height: 40,
    justifyContent: 'center',
  },
  vehicleListContainer: {
    paddingVertical: 10,
  },
  vehicleButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  selectedVehicleButton: {
    borderColor: '#008B8B',
    borderWidth: 2,
    backgroundColor: '#E6F3F3',
  },
  vehicleImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  vehicleText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
  },
});

export default PostATripScreen;
