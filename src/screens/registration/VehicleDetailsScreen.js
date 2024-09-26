import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import CustomLoader from '../../components/CustomLoader';
import CustomButton from '../../components/ui/CustomButton';
import CustomDropdown from '../../components/ui/CustomDropdown';
import CustomTextInput from '../../components/ui/CustomTextInput';
import { i18n } from '../../constants/lang';
import { VehicleDetailSchema } from '../../constants/schema/VehicleDetailSchema';
import { fieldNames } from '../../constants/strings/fieldNames';
import { useTheme } from '../../hooks/useTheme';
import {
  createVehicleDetail,
  fetchVehicleNames,
  fetchVehicleTypes,
  getAllVehiclesByUserId,
} from '../../services/vehicleDetailsService';
import { getUserDataSelector } from '../../store/selectors';
import { showSnackbar } from '../../store/slices/snackBarSlice';
import { getIdByName } from '../../utils/getIdByNameUtil';

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
  const dispatch = useDispatch();
  const userData = useSelector(getUserDataSelector);
  const userId = userData.userId;
  const userToken = userData.userToken;

  const { theme } = useTheme();
  const [vehicleTypes, setVehicleTypes] = useState({ data: [] });
  const [vehicleNames, setVehicleNames] = useState({ data: [] });
  const [userRoleId, setUserRoleId] = useState(null);
  const [filteredVehicleNames, setFilteredVehicleNames] = useState([]);
  const [initialVehicleList, setInitialVehicleList] = useState(null);
  const [seatingCapacityData, setSeatingCapacityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { control, handleSubmit, setValue, reset, watch } = useForm({
    resolver: yupResolver(VehicleDetailSchema),
    defaultValues: {
      [fieldNames.VEHICLE_REGISTRATION_NUMBER]: '',
      [fieldNames.VEHICLE_TYPE]: '',
      [fieldNames.VEHICLE_NAME]: '',
      [fieldNames.VEHICLE_MODEL]: '',
      [fieldNames.VEHICLE_SEATING_CAPACITY]: '',
    },
  });

  const [openDropdown, setOpenDropdown] = useState(null);

  const watchVehicleType = watch(fieldNames.VEHICLE_TYPE);
  const watchVehicleName = watch(fieldNames.VEHICLE_NAME);

  useEffect(() => {
    getVehicleDetails();
  }, []);

  const getVehicleDetails = async () => {
    setIsLoading(true);
    try {
      const vehicleTypeResponse = await fetchVehicleTypes();
      const vehicleNameResponse = await fetchVehicleNames();

      if (vehicleTypeResponse && vehicleTypeResponse.data) {
        setVehicleTypes(vehicleTypeResponse);
      } else {
        console.error('Invalid vehicleTypeResponse:', vehicleTypeResponse);
      }

      if (vehicleNameResponse && vehicleNameResponse.data) {
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
      } else {
        console.error('Invalid vehicleNameResponse:', vehicleNameResponse);
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      setUserRoleId(userData.userRoleId);
    }
  }, [userData]);

  useEffect(() => {
    if (userToken && userId) {
      getVehiclesList();
    }
  }, [userToken, userId]);

  const getVehiclesList = async () => {
    const response = await getAllVehiclesByUserId(userToken, userId);
    if (response.error === false && response.noOfRecords > 0) {
      setInitialVehicleList(response.data[0]);
    } else {
      setInitialVehicleList(null);
    }
  };

  useEffect(() => {
    if (watchVehicleType) {
      // Filter vehicle names based on the selected vehicle type
      const filteredNames = vehicleNames.data.filter(
        (vehicle) => vehicle.vehicleType.v_type === watchVehicleType,
      );
      setFilteredVehicleNames(filteredNames);

      // Clear vehicle name and seating capacity in the form
      setValue(fieldNames.VEHICLE_NAME, undefined, { shouldValidate: true });
      setValue(fieldNames.VEHICLE_SEATING_CAPACITY, undefined, {
        shouldValidate: true,
      });

      // Reset the seating capacity data to the original full list
      setSeatingCapacityData(
        removeDuplicatesBySeatingCapacity(vehicleNames.data).map((vehicle) => ({
          value: vehicle.seating_capacity,
          label: vehicle.seating_capacity,
          ...vehicle,
        })),
      );
    }
  }, [watchVehicleType, vehicleNames.data, setValue]);

  useEffect(() => {
    if (watchVehicleName) {
      updateSeatingCapacity(watchVehicleName);
    }
  }, [watchVehicleName]);

  const updateSeatingCapacity = (vehicleName) => {
    const selectedVehicle = vehicleNames.data.find(
      (vehicle) => vehicle.v_name === vehicleName,
    );
    if (selectedVehicle) {
      const matchingCapacity = seatingCapacityData.find(
        (cap) => cap.seating_capacity === selectedVehicle.seating_capacity,
      );
      if (matchingCapacity) {
        setSeatingCapacityData([matchingCapacity]);
        setValue(
          fieldNames.VEHICLE_SEATING_CAPACITY,
          matchingCapacity.seating_capacity,
          { shouldValidate: true },
        );
      }
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
          break;
        case fieldNames.VEHICLE_NAME:
          value = item.v_name;
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

  useEffect(() => {
    if (initialVehicleList) {
      reset({
        [fieldNames.VEHICLE_REGISTRATION_NUMBER]:
          initialVehicleList.vehicles.v_registration_number || '',
        [fieldNames.VEHICLE_TYPE]:
          initialVehicleList.vehicles.VehicleTypes.v_type || '',
        [fieldNames.VEHICLE_NAME]:
          initialVehicleList.vehicles.VehicleNames.v_name || '',
        [fieldNames.VEHICLE_MODEL]: initialVehicleList.vehicles.v_model || '',
        [fieldNames.VEHICLE_SEATING_CAPACITY]:
          initialVehicleList.vehicles.v_seating_cpcty || '',
      });
    }
  }, [initialVehicleList, reset]);

  const onSubmit = async (data) => {
    const { nameId, typeId } = await getIdByName(
      vehicleNames.data,
      data.vehicleName,
    );

    if (
      !data.vehicleName &&
      !data.vehicleRegistrationNumber &&
      !data.vehicleModel &&
      !data.vehicleSeatingCapacity
    ) {
      userRoleId == 3000
        ? navigation.navigate('BusinessDetails')
        : navigation.navigate('VehicleAndDriverDocuments');
      reset();
    } else {
      const finalData = {
        vehicle_names_id: nameId,
        vehicle_types_id: typeId,
        v_registration_number: data.vehicleRegistrationNumber,
        v_model: data.vehicleModel,
        v_seating_cpcty: data.vehicleSeatingCapacity,
        user_id: userId,
        driver_id: userId,
      };

      const response = await createVehicleDetail(finalData, userToken);

      if (response?.newVehicle.created_at) {
        userRoleId == 3000
          ? navigation.navigate('BusinessDetails')
          : navigation.navigate('VehicleAndDriverDocuments');
        reset();
      } else {
        dispatch(
          showSnackbar({
            visible: true,
            message: 'something went wrong',
            type: 'Error',
          }),
        );
      }
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
                    filteredVehicleNames) ||
                  (item.placeholder === i18n.t('VEHICLE_SEATING_CAPACITY') &&
                    seatingCapacityData)
                }
                isOpen={openDropdown === item.id}
                onToggle={() => handleDropdownToggle(item.id)}
                onSelect={(selectedItem) =>
                  handleDropdownSelect(item.id, selectedItem)
                }
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

  if (isLoading) {
    return <CustomLoader />; // Replace with your loading component
  }

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
              onPress={onSubmit}
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

export default VehicleDetailsScreen;
