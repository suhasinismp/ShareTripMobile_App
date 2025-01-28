


import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    FlatList, Image,
} from 'react-native';
import AppHeader from '../../../components/AppHeader';
import CustomText from '../../../components/ui/CustomText';
import CustomInput from '../../../components/ui/CustomInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../../../components/ui/CustomButton';
import { useTheme } from '../../../hooks/useTheme';
import CustomSelect from '../../../components/ui/CustomSelect';
import TimeDatePicker from '../../../components/TimeDatePicker';
import AudioContainer from '../../../components/AudioContainer';
import MicIcon from '../../../../assets/svgs/mic.svg';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getUserDataSelector } from '../../../store/selectors';
import { getTripTypes } from '../../../services/postTripService';
// import { getUserProfileByUserId, getAllVehiclesByUserId, selfCreatePost } from '../../../services/selfTripService';
import { getAllVehiclesByUserId } from '../../../services/vehicleDetailsService';
import { getProfileByUserId } from '../../../services/profileScreenService';
import { selfCreatePost } from '../../../services/selfTripService';
import CustomModal from '../../../components/ui/CustomModal';


const { width } = Dimensions.get('window');

const CreateSelfTrip = () => {
    const navigation = useNavigation();
    const userData = useSelector(getUserDataSelector);
    const userToken = userData.userToken;
    const userId = userData.userId;
    const { theme } = useTheme();
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudioUri, setRecordedAudioUri] = useState(null);
    const [message, setMessage] = useState('');
    const [notes, setNotes] = useState('');
    // const [notes1, setNotes1] = useState('');
    const [selectedPaymentType, setSelectedPaymentType] = useState('Cash');
    const [selectedFromDate, setSelectedFromDate] = useState(new Date());
    const [userProfile, setUserProfile] = useState([]);

    const [selectedToDate, setSelectedToDate] = useState(new Date());

    const [userVehicles, setUserVehicles] = useState([]);

    const [selectedTime, setSelectedTime] = useState(new Date());
    const [selectedTripType, setSelectedTripType] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false)
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropLocation, setDropLocation] = useState('');
    const [visitingPlace, setVisitingPlace] = useState('');
    const [selfTripTypes, setSelfTripTypes] = useState([]);
    const [baseRate, setBaseRate] = useState('');
    const [extraKms, setExtraKms] = useState('');
    const [extraHrs, setExtraHrs] = useState('');
    const [dayBata, setDayBata] = useState('');
    const [nightBata, setNightBata] = useState('')
    const [slabRate, setSlabRate] = useState('');
    // const [showTariffModal, setShowTariffModal] = useState('');
    const [packages, setPackages] = useState([]);

    const resetFields = () => {
        setCustomerName('');
        setCustomerPhone('');
        setIsRecording(false);
        setRecordedAudioUri(null);
        setMessage('');
        setNotes('');
        setSelectedPaymentType('Cash');
        setSelectedFromDate(new Date());
        setSelectedToDate(new Date());
        setSelectedTime(new Date());
        setSelectedTripType(null);
        setSelectedPackage(null);
        setModalVisible(false)
        setPickupLocation('')
        setDropLocation('')
        setVisitingPlace('')
        setSelfTripTypes('')
        setBaseRate('')
        setExtraKms('')
        setExtraHrs('')
        setDayBata('')
        setNightBata('')
        setSlabRate('')
        setPackages('')
    };

    useEffect(() => {
        getUserVehicles();
        getUserProfile();
    }, [userId, userToken]);

    useEffect(() => {
        fetchSelfTrips();
    }, []);

    useEffect(() => {
        if (selfTripTypes.length > 0) {
            const localTripType = selfTripTypes.find(
                (trip) => trip.booking_type_name === 'LOCAL',
            );
            if (localTripType) {
                setSelectedTripType(localTripType.id);
                const localPackages = localTripType.bookingTypePackageAsBookingType;
                if (localPackages.length > 0) {
                    setSelectedPackage(localPackages[0].id);
                }
            }
        }
    }, [selfTripTypes]);

    useEffect(() => {
        getPackagesByTripTypeId()
    }, [selectedTripType]);

    const getPackagesByTripTypeId = () => {
        const tripTypeId = selectedTripType;

        const packages = selfTripTypes?.find((item) =>
            item.id === tripTypeId
        )
        setPackages(packages?.bookingTypePackageAsBookingType)

    }



    const handleStartRecording = () => {
        setIsRecording(true);
    };
    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleStopRecording = (uri) => {
        setIsRecording(false);
        setRecordedAudioUri(uri);
    };
    const handleFromDateChange = (newDate) => {
        setSelectedFromDate(newDate);
    };
    const handleToDateChange = (newDate) => {
        setSelectedToDate(newDate);
    };
    const handleTimeChange = (newTime) => {
        setSelectedTime(newTime);
    };
    const handleDeleteRecording = () => {
        setRecordedAudioUri(null);
    };

    const getUserVehicles = async () => {
        const response = await getAllVehiclesByUserId(userToken, userId);

        setUserVehicles(response.data);
    };

    const getUserProfile = async () => {
        const response = await getProfileByUserId(userToken, userId);

        setUserProfile(response.data)
    }


    const fetchSelfTrips = async () => {
        const response = await getTripTypes(userToken);

        if (response.error === false) {
            setSelfTripTypes(response.data);
        }
    }
    const renderSelectItem = useCallback(
        ({ item, isSelected, onPress, textKey }) => (
            <CustomSelect
                text={item[textKey]}
                containerStyle={styles.selectItem}
                selectedTextStyle={styles.selectedText}
                selectedStyle={styles.selectedBackground}
                isSelected={isSelected}
                onPress={onPress}
                unselectedStyle={styles.unselectedBorder}
                textStyle={styles.selectedText}
            />
        ),
        [],


    );


    const handleSave = async () => {
        // Debugging: Check userVehicles


        if (!userVehicles || userVehicles.length === 0 ||
            !userVehicles[0]?.vehicles?.vehicle_types_id ||
            !userVehicles[0]?.vehicles?.vehicle_names_id) {
            alert('Vehicle Type ID and Vehicle Name ID are required.');
            return;
        }

        if (message.length === 0 && !recordedAudioUri) {
            alert('Please enter a message or record an audio');
            return;
        }


        let finalData = {
            posted_user_id: userId,
            post_status: 'Available',
            vehicle_type_id: userVehicles[0].vehicles.vehicle_types_id,
            vehicle_name_id: userVehicles[0].vehicles.vehicle_names_id
        };

        if (message.length > 0) finalData.message = message;
        if (customerName) finalData.customer_name = customerName;
        if (customerPhone) finalData.customer_phone_no = customerPhone;
        if (selectedPaymentType) finalData.payment_type = selectedPaymentType;
        if (selectedTripType) finalData.booking_type_id = selectedTripType;
        if (selectedPackage) finalData.booking_types_package_id = selectedPackage;
        if (notes) finalData.notes = notes;
        if (selectedTime) finalData.pick_up_time = selectedTime;
        if (selectedFromDate) finalData.from_date = selectedFromDate;
        if (selectedToDate) finalData.to_date = selectedToDate;
        if (pickupLocation) finalData.pick_up_location = pickupLocation;
        if (dropLocation) finalData.destination = dropLocation;
        if (visitingPlace) finalData.visiting_place = visitingPlace;
        if (baseRate) finalData.base_fare_rate = baseRate;
        if (extraKms) finalData.extra_km_rate = extraKms;
        if (extraHrs) finalData.extra_hr_rate = extraHrs;
        if (nightBata) finalData.night_batta_rate = nightBata;
        if (slabRate) finalData.slab_rate = slabRate;
        if (dayBata) finalData.day_batta_rate = dayBata;

        // Debugging: Check finalData before sending


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

        // Debugging: Check formData


        const response = await selfCreatePost(formData, userToken);
        console.log('vineet', response)
        if (!response.error) {
            resetFields();
            navigation.goBack();

        } else {
            alert(response.message);
        }
    };



    return (
        <>
            <AppHeader
                drawerIcon={true}
                groupIcon={true}
                onlineIcon={true}
                muteIcon={true}
                search={true}
            />
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>Self Trips</Text>

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

                <View style={{ ...styles.sectionContainer, gap: 2 }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginBottom: 20 }}>

                        <View style={{ flexDirection: 'column' }}>
                            <Image
                                source={{ uri: userProfile.u_profile_pic }} // Assuming imageUrl holds the URL for the vehicle image
                                style={styles.image}
                            />
                            <Text style={{ marginLeft: 25 }}>{userProfile.u_name}</Text>
                            <Text style={{ marginLeft: 15 }}>{userProfile.u_mob_num}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', }}>
                            <Image
                                source={{ uri: userVehicles[0]?.vehicles?.VehicleNames?.v_pic }} // Assuming imageUrl holds the URL for the vehicle image
                                style={styles.image}
                            />
                            <Text style={{ marginLeft: 20 }}> {userVehicles[0]?.vehicles?.VehicleNames?.v_name} </Text>
                            <Text>{userVehicles[0]?.vehicles?.v_registration_number}</Text>
                        </View>
                    </View>


                    <CustomText text="Customer Details :" variant="sectionTitleText" />
                    <CustomInput
                        placeholder="Customer Name"
                        value={customerName}
                        onChangeText={setCustomerName}
                    />
                    <CustomInput
                        placeholder="Customer Phone"
                        value={customerPhone}
                        onChangeText={setCustomerPhone}
                    />
                </View>

                <View style={styles.sectionContainer}>
                    <CustomInput
                        placeholder="Type your message"
                        value={message}
                        onChangeText={setMessage}
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
                <View style={styles.sectionContainer}>
                    <CustomText
                        text={'Select Trip Type :'}
                        variant={'sectionTitleText'}
                    />
                    <FlatList
                        data={selfTripTypes}
                        renderItem={({ item }) =>
                            renderSelectItem({
                                item,
                                isSelected: selectedTripType === item.id,
                                onPress: () => {
                                    setSelectedTripType(item.id);
                                    const packages = item.bookingTypePackageAsBookingType;
                                    if (packages.length > 0) {
                                        setSelectedPackage(packages[0].id);
                                    } else {
                                        setSelectedPackage(null);
                                    }
                                },
                                textKey: 'booking_type_name',
                            })
                        }
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.listContentContainer}
                    />
                </View>

                <View style={styles.sectionContainer}>
                    <CustomText text={'Select Package :'} variant={'sectionTitleText'} />
                    <FlatList
                        data={packages}
                        renderItem={({ item }) =>
                            renderSelectItem({
                                item,
                                isSelected: selectedPackage === item.id,
                                onPress: () => setSelectedPackage(item.id),
                                textKey: 'package_name',
                            })
                        }
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.listContentContainer}
                    />
                </View>
                <View style={styles.sectionContainer}>
                    <CustomText text={'Tariff :'} variant={'sectionTitleText'} />
                    <View style={styles.tariffContainer}>
                        <View style={styles.tariffRow}>
                            <CustomInput
                                placeholder="Rate"
                                value={baseRate}
                                onChangeText={setBaseRate}
                                style={styles.tariffInput}
                                keyboardType="numeric"
                            />
                            {selectedTripType !== 2 && (
                                <CustomInput
                                    placeholder="Extra Kms"
                                    value={extraKms}
                                    onChangeText={setExtraKms}
                                    style={styles.tariffInput}
                                    keyboardType="numeric"
                                />
                            )}
                        </View>
                        <View style={styles.tariffRow}>
                            {selectedTripType !== 2 && selectedTripType !== 3 && (
                                <CustomInput
                                    placeholder="Extra Hours"
                                    value={extraHrs}
                                    onChangeText={setExtraHrs}
                                    style={styles.tariffInput}
                                    keyboardType="numeric"
                                />
                            )}
                            {selectedTripType !== 1 && selectedTripType !== 3 && (
                                <CustomInput
                                    placeholder="Day Batta"
                                    value={dayBata}
                                    onChangeText={setDayBata}
                                    style={styles.tariffInput}
                                    keyboardType="numeric"
                                />
                            )}
                        </View>

                        <View style={styles.tariffRow}>
                            {selectedTripType != 1 && selectedTripType != 2 && selectedTripType != 3 && (
                                <CustomInput
                                    placeholder="Night Batta"
                                    value={nightBata}
                                    onChangeText={setNightBata}
                                    style={styles.tariffInput}
                                    keyboardType="numeric"
                                />
                            )}
                        </View>

                        {selectedTripType === 3 && (
                            <View style={styles.tariffRow}>
                                <CustomInput
                                    placeholder="Slab Rate"
                                    value={slabRate}
                                    onChangeText={setSlabRate}
                                    style={styles.tariffInput}
                                    keyboardType="numeric"
                                />

                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <CustomText
                        text={'Payment / Duty Type :'}
                        variant={'sectionTitleText'}
                    />
                    <View style={styles.paymentTypeContainer}>
                        <CustomSelect
                            text={'Cash'}
                            containerStyle={styles.paymentType}
                            selectedTextStyle={styles.selectedText}
                            selectedStyle={styles.selectedBackground}
                            isSelected={selectedPaymentType === 'Cash'}
                            onPress={() => setSelectedPaymentType('Cash')}
                            unselectedStyle={styles.unselectedBorder}
                        />
                        <CustomSelect
                            text={'Credit'}
                            containerStyle={styles.paymentType}
                            selectedTextStyle={styles.selectedText}
                            selectedStyle={styles.selectedBackground}
                            isSelected={selectedPaymentType === 'Credit'}
                            onPress={() => setSelectedPaymentType('Credit')}
                            unselectedStyle={styles.unselectedBorder}
                        />
                    </View>
                </View>

                <View style={{ ...styles.sectionContainer, gap: 10 }}>
                    <CustomText text={'Notes :'} variant={'sectionTitleText'} />
                    <CustomInput
                        placeholder="Type your message"
                        value={notes}
                        onChangeText={setNotes}
                        multiline={true}
                    />
                    {/* <CustomInput
                        placeholder="Type your message"
                        value={notes1}
                        onChangeText={setNotes1}
                        multiline={true}
                    /> */}
                </View>
                <View style={styles.sectionContainer}>
                    <CustomText text={'Date & Time :'} variant={'sectionTitleText'} />
                    <View style={styles.dateTimeContainer}>
                        <TimeDatePicker
                            fromDate={selectedFromDate}
                            toDate={selectedToDate}
                            time={selectedTime}
                            onFromDateChange={handleFromDateChange}
                            onToDateChange={handleToDateChange}
                            onTimeChange={handleTimeChange}
                        />
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <CustomText
                        text={'Pick Up / Drop Location Detail :'}
                        variant={'sectionTitleText'}
                    />
                    <View style={{ marginTop: 4, gap: 10 }}>
                        <View style={styles.inputRow}>
                            {/* <Ionicons
              name="location"
              size={24}
              color="#4CAF50"
              style={styles.inputIcon}
            /> */}
                            <CustomInput
                                placeholder="Enter Pickup Location"
                                value={pickupLocation}
                                onChangeText={setPickupLocation}
                                style={styles.fullWidthInput}
                            />
                        </View>
                        <View style={styles.inputRow}>
                            {/* <Ionicons
              name="location"
              size={24}
              color="#FF5722"
              style={styles.inputIcon}
            /> */}
                            <CustomInput
                                placeholder="Enter Drop off Location"
                                value={dropLocation}
                                onChangeText={setDropLocation}
                                style={styles.fullWidthInput}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <CustomText text={'Visiting Place'} variant={'sectionTitleText'} />
                    <View style={{ marginTop: 4 }}>
                        <View style={styles.inputRow}>
                            {/* <Ionicons
              name="navigate-circle-outline"
              size={24}
              color="#2196F3"
              style={styles.inputIcon}
            /> */}
                            <CustomInput
                                placeholder="Enter Visiting Place"
                                value={visitingPlace}
                                onChangeText={setVisitingPlace}
                                style={styles.fullWidthInput}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <CustomButton
                        title="Cancel"
                        variant="text"
                        style={styles.cancelButton}
                        onPress={() => {
                            // Handle cancel action
                        }}
                    />
                    <CustomButton
                        title="save Trip"
                        style={styles.submitButton}
                        onPress={handleSave}
                    />
                </View>




                <View style={{ marginBottom: 40 }} />
            </KeyboardAwareScrollView >
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F3F5FD',
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
    selectedPostTypeText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    },
    selectedText: {
        color: '#000000',
        fontSize: 14,
        textAlign: 'center',
    },
    selectedPostTypeBackground: { backgroundColor: '#008B8B' },
    selectedBackground: {
        backgroundColor: '#6DB8F0',
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 30,
        marginLeft: 20
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
    selectItem: {
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
    shareTypeContainer: {
        marginTop: 16,
    },
    shareTypeList: {
        justifyContent: 'space-between',
    },
    paymentTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    paymentType: {
        width: width * 0.4,
        height: 40,
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: '#005680',
        borderRadius: 4,
        width: width * 0.4,
        alignItems: 'center',
    },
    submitButton: {
        width: width * 0.4,
        alignItems: 'center',
        backgroundColor: '#123F67',
        borderRadius: 4,
    },
    dateTimeContainer: {
        justifyContent: 'space-between',
        marginTop: 8,
        gap: 10,
    },
    dateTimeButton: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 4,
        padding: 10,
        width: width * 0.3,
        alignItems: 'center',
    },
    tariffContainer: {
        marginTop: 8,
    },
    tariffRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    tariffInput: {
        width: '40%',
        height: 30,
    },
});

export default CreateSelfTrip;
