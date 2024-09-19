



import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { fieldNames } from '../../constants/strings/fieldNames';
import { i18n } from '../../constants/lang';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useForm, Controller } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '../../components/ui/CustomTextInput';
import CustomButton from '../../components/ui/CustomButton';
import CustomDropdown from '../../components/ui/CustomDropdown';
import {
  createVehicleDetail,
  fetchVehicleNames,
  fetchVehicleTypes,
} from '../../services/vehicleDetailsService';
import { yupResolver } from '@hookform/resolvers/yup';
import { VehicleDetailSchema } from '../../constants/schema/VehicleDetailSchema';
import { getIdByName } from '../../utils/getIdByNameUtil';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDataSelector } from '../../store/selectors';
import { showSnackbar } from '../../store/slices/snackBarSlice';

const inputFields = [
  {
    id: 3,
    name: fieldNames.VEHICLE_REGISTRATION_NUMBER,
    placeholder: i18n.t('VEHICLE_REGISTRATION_NUMBER'),
    fieldType: 'input',
  },
  {
    id: 2,
    name: fieldNames.VEHICLE_TYPE,
    placeholder: i18n.t('VEHICLE_TYPE'),
    fieldType: 'dropDown',
  },
  {
    id: 1,
    name: fieldNames.VEHICLE_NAME,
    placeholder: i18n.t('VEHICLE_NAME'),
    fieldType: 'dropDown',
  },
  {
    id: 5,
    name: fieldNames.VEHICLE_MODEL,
    placeholder: i18n.t('VEHICLE_MODEL'),
    fieldType: 'input',
    keyboardType: 'numeric',
  },
  {
    id: 4,
    name: fieldNames.VEHICLE_SEATING_CAPACITY,
    placeholder: i18n.t('VEHICLE_SEATING_CAPACITY'),
    fieldType: 'dropDown',
  },
];

const removeDuplicatesBySeatingCapacity = (data) => {
  const seenCapacities = new Set();
  return data.filter((vehicle) => {
    if (!seenCapacities.has(vehicle.seating_capacity)) {
      seenCapacities.add(vehicle.seating_capacity);
      return true;
    }
    return false;
  });
};

const VehicleDetailsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const userData = useSelector(getUserDataSelector)
 const userId =userData.userId
 const userToken = userData.userToken
  const { theme } = useTheme()
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicleNames, setVehicleNames] = useState([]);
  const [filteredVehicleNames, setFilteredVehicleNames] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);

  const [seatingCapacityData, setSeatingCapacityData] = useState([]);
  const { control, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(VehicleDetailSchema),
  });
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    getVehicleDetails();
  }, []);

  const getVehicleDetails = async () => {
    try {
      const vehicleTypeResponse = await fetchVehicleTypes();
      const vehicleNameResponse = await fetchVehicleNames();

      setVehicleTypes(vehicleTypeResponse);
      setVehicleNames(vehicleNameResponse);

      const uniqueSeatingCapacityData = removeDuplicatesBySeatingCapacity(
        vehicleNameResponse.data,
      );
      setSeatingCapacityData(
        uniqueSeatingCapacityData.map((vehicle) => ({
          value: vehicle.seating_capacity,
          label: vehicle.seating_capacity,
          ...vehicle,
        })),
      );
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    }
  };

  const handleDropdownToggle = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };
  const handleDropdownSelect = (id, item) => {
    const field = inputFields.find((field) => field.id === id);
    if (field) {
      let value;
      switch (field.name) {
        case fieldNames.VEHICLE_TYPE:
          value = item.v_type;
          setSelectedVehicleType(item.v_type);
          filterVehicleNames(item.v_type);
          break;
        case fieldNames.VEHICLE_NAME:
          value = item.v_name;
  
          // Prefill seating capacity based on the selected vehicle name
          const selectedVehicle = vehicleNames.data.find(
            (vehicle) => vehicle.v_name === item.v_name
          );
          if (selectedVehicle) {
            const matchingCapacity = seatingCapacityData.find(
              (cap) => cap.seating_capacity === selectedVehicle.seating_capacity
            );
            if (matchingCapacity) {
              setSeatingCapacityData([matchingCapacity]); // Prefill dropdown with matching capacity
              setValue(
                fieldNames.VEHICLE_SEATING_CAPACITY,
                matchingCapacity.seating_capacity,
                { shouldValidate: true }
              );
            }
          }
          break;
        case fieldNames.VEHICLE_SEATING_CAPACITY:
          value = item.seating_capacity;
          break;
        default:
          value = item.value;
      }
  
      setValue(field.name, value, { shouldValidate: true });
    }
  };
  
  
  
  const filterVehicleNames = (vehicleType) => {
    const filteredNames = vehicleNames.data.filter(
      (vehicle) => vehicle.vehicleType.v_type === vehicleType,
    );
    setFilteredVehicleNames(filteredNames);
  };

  const onSubmit = async (data) => {

    const {nameId, typeId} = await getIdByName(
      vehicleNames.data,
      data.vehicleName,
    );
   
    const finalData ={
      "vehicle_names_id":nameId,
     
      "vehicle_types_id":typeId,
      "v_registration_number":data.vehicleRegistrationNumber,
      "v_model":data.vehicleModel,
      "v_seating_cpcty":data.vehicleSeatingCapacity,
      "user_id": userId,
    "driver_id": userId,
  }

  const response =await createVehicleDetail(finalData,userToken )
  
   if (response?.newVehicle.created_at){
    navigation.navigate('BusinessDetails');
   }
   else{
    dispatch(showSnackbar({visible:true,message:'something went wrong', type:'Error'}))
   }
   
    
  };

  const renderField = (item) => {
    switch (item.fieldType) {
      case 'dropDown':
        return (
          <Controller
            key={item.id}
            control={control}
            name={item.name}
            render={({ field: { onChange, value } }) => (
              <CustomDropdown
                placeholder={item.placeholder}
                data={
                  (item.placeholder === i18n.t('VEHICLE_TYPE') &&
                    vehicleTypes.data) ||
                  (item.placeholder === i18n.t('VEHICLE_NAME') &&
                    filteredVehicleNames) || // Use filtered vehicle names
                  (item.placeholder === i18n.t('VEHICLE_SEATING_CAPACITY') &&
                    seatingCapacityData)
                }
                isOpen={openDropdown === item.id}
                onToggle={() => handleDropdownToggle(item.id)}
                onSelect={(selectedItem) => {
                  handleDropdownSelect(item.id, selectedItem);
                }}
                label={
                  (item.placeholder === i18n.t('VEHICLE_TYPE') && 'v_type') ||
                  (item.placeholder === i18n.t('VEHICLE_NAME') && 'v_name') ||
                  (item.placeholder === i18n.t('VEHICLE_SEATING_CAPACITY') &&
                    'seating_capacity')
                }
                value={value}
              />
            )}
          />
        );
      case 'input':
        return (
          <CustomTextInput
            key={item.id}
            control={control}
            name={item.name}
            placeholder={item.placeholder}
            secureTextEntry={item.secureTextEntry}
            keyboardType={item.keyboardType}
          />
        );
      default:
        return null;
    }
  };

  return (
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {inputFields.map(renderField)}

          <View style={styles.buttonContainer}>
            <CustomButton
              title={i18n.t('SKIP')}
              onPress={() => {}}
              variant="text"
            />
            <CustomButton
              title={i18n.t('SIGNUP_BUTTON')}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  innerContainer: {
    marginTop: 22,
    rowGap: 15,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default VehicleDetailsScreen
