import React from 'react'
import { TouchableOpacity } from 'react-native';
import CustomInput from '../ui/CustomInput';

const CardTripSheetEdit = () => {
    return (
        <view>
            <TouchableOpacity style={{}} onPress={edit}>

            </TouchableOpacity>
            <CustomInput
                placeholder="Trip Time"
                value={TripTime}
                onChangeText={setTripTime}
                keyboardType="numeric"
            />

        </view>
    )
}

export default CardTripSheetEdit;
