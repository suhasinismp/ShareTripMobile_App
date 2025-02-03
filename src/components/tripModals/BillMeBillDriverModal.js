import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';



const BillMeBillDriverModal = ({ onClose, SetBillToDriver, handleContinue, SetBillToMe, BillToMe, handleCancel }) => {
    const [selectedOption, setSelectedOption] = useState('');



    // Options
    const options = [
        // { id: '1', label: 'Bill to Me', value: false },
        { id: '1', label: 'Bill to Driver', value: true }
    ];


    const handleSelect = (value) => {
        setSelectedOption(value);
        SetBillToMe((pre) => !pre);
    }

    return (
        <View style={style.modalContainer}>
            <TouchableOpacity
                style={{ position: 'absolute', top: 10, right: 10 }} onPress={onClose}
            >
                <FontAwesome name="times" size={24} color="#333" />

            </TouchableOpacity>
            <Text style={StyleSheet.modalTitle}>Billing Details</Text>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.id}
                    style={style.radioContainer}
                    onPress={() => handleSelect(option.value)}
                >
                    <FontAwesome
                        name={BillToMe === true ? "dot-circle-o" : "circle-o"}
                        size={24}
                        color="#004c75"
                        style={style.radioIcon}
                    />
                    <Text style={style.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={{ backgroundColor: '#1e4976', padding: 16, borderRadius: 8, marginVertical: 8, }} onPress={handleContinue}>
                <Text style={style.actionButtonText}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                backgroundColor: '#1e4976',
                padding: 16,
                borderRadius: 8,
                marginVertical: 8,
            }} onPress={handleCancel}>
                <Text style={style.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    modalContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center'

    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
        marginBottom: 20
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        width: '100%',
    },
    radioIcon: {
        marginRight: 10,
    },
    radioLabel: {
        fontSize: 16,
        color: '#333',
    },
    continueButton: {
        backgroundColor: '#004c75',
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 5,
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#ddd',
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    }
})
export default BillMeBillDriverModal