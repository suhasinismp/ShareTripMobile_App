import React from 'react'
import CustomInput from '../ui/CustomInput';
import { FontAwesome } from '@expo/vector-icons';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


const TripBillEditModal = ({
    startTripKms,
    setStartTripKms,
    startTime,
    setStartTime,
    startDate,
    setStartDate,
    endTripKms,
    setEndTripKms,
    endTripTime,
    setEndTripTime,
    endTripDate,
    setEndTripDate,
    showTimePicker,
    setShowTimePicker,
    showDatePicker,
    setShowDatePicker,
    handleTripBillEdit,
    setShowTripBillEditModal,
    onClose,
}) => {



    return (
        <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Trip Table details </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <FontAwesome name="times" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.inputGroup}>
                <CustomInput
                    placeholder="Start Kms"
                    value={startTripKms}
                    onChangeText={setStartTripKms}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputGroup}>
                <CustomInput
                    placeholder="End Kms"
                    value={endTripKms}
                    onChangeText={setEndTripKms}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputGroup}>
                <CustomInput
                    placeholder="startTime"
                    value={startTime}
                    onChangeText={setStartTime}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputGroup}>
                <CustomInput
                    placeholder="End Time"
                    value={endTripTime}
                    onChangeText={setEndTripTime}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputGroup}>
                <CustomInput
                    placeholder="startDate"
                    value={startDate}
                    onChangeText={setStartDate}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputGroup}>
                <CustomInput
                    placeholder="End Date"
                    value={endTripDate}
                    onChangeText={setEndTripDate}
                    keyboardType="numeric"
                />
            </View>




            {/* <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Opening Time</Text>
                <TouchableOpacity
                    style={styles.timePickerContainer}
                    onPress={() => setShowTimePicker(true)}
                >
                    <FontAwesome
                        name="clock-o"
                        size={20}
                        color="#666"
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.pickerInput}
                        value={openingTime}
                        placeholder="HH:MM AM/PM"
                        editable={false}
                        placeholderTextColor="#999"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Opening Date</Text>
                <TouchableOpacity
                    style={styles.timePickerContainer}
                    onPress={() => setShowDatePicker(true)}
                >
                    <FontAwesome
                        name="calendar"
                        size={20}
                        color="#666"
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.pickerInput}
                        value={openingDate}
                        placeholder="YYYY/MM/DD"
                        editable={false}
                        placeholderTextColor="#999"
                    />
                </TouchableOpacity>
            </View> */}


            <TouchableOpacity style={styles.updateButton} onPress={handleTripBillEdit}>
                <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
        </View >
    )
}

const styles = StyleSheet.create({
    modalContent: {
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    inputGroup: {
        // flexDirection: "column",
        // justifyContent: "space-between",
        // alignItems: "center",
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    timePickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    listContainer: {
        flex: 1,
        marginHorizontal: 20,
    },
    listContent: {
        paddingBottom: 20,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,

    },
    filterRow2: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: 5,
        gap: 10,


    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    pickerInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    updateButton: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    updateButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default TripBillEditModal;



