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
    totalTime,
    setTotalTime,
    totalHrs,
    setTotalHrs,
    totalKms,
    setTotalKms,
    total,
    setTotal,
    showTimePicker,
    setShowTimePicker,
    showDatePicker,
    setShowDatePicker,
    onClose,
}) => {

    const handleViewTripUpdate = async () => {
        const response = await ViewTripBillEdit

    };

    return (
        <View style={styles.modalContent}>
            {/* Time Input */}
            {/* <View style={styles.inputGroup}> */}
            {/* <CustomInput
                placeholder="Total time"
                value={totalTime}
                onChangeText={setTotalTime}
                keyboardType="numeric"
            /> */}
            <TouchableOpacity
                style={styles.timePickerContainer}
                onPress={() => setShowTimePicker(true)}
            >
                <FontAwesome name="clock-o" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                    style={styles.pickerInput}
                    value={totalTime}
                    placeholder="HH:MM AM/PM"
                    editable={false}
                    placeholderTextColor="#999"
                />
            </TouchableOpacity>
            {/* </View> */}

            {/* Date Picker */}
            <TouchableOpacity style={styles.timePickerContainer} onPress={() => setShowDatePicker(true)}>
                <FontAwesome name="calendar" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                    style={styles.pickerInput}
                    value={totalHrs}
                    placeholder="YYYY/MM/DD"
                    editable={false}
                    placeholderTextColor="#999"
                />
            </TouchableOpacity>

            {/* Time Picker Modal */}
            {
                showTimePicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowTimePicker(false);
                            if (selectedDate) {
                                const formattedTime = selectedDate.toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                });
                                setTotalHrs(formattedTime);
                            }
                        }}
                    />
                )
            }

            {/* Date Picker Modal */}
            {
                showDatePicker && (
                    <DateTimePicker
                        value={totalTime ? new Date(totalTime.replace(/\//g, "-")) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                const formattedDate = `${selectedDate.getFullYear()}/${String(
                                    selectedDate.getMonth() + 1
                                ).padStart(2, "0")}/${String(selectedDate.getDate()).padStart(2, "0")}`;
                                setTotalTime(formattedDate);
                            }
                        }}
                    />
                )
            }

            {/* Other Inputs */}
            <CustomInput placeholder="Total Kms" value={totalKms} onChangeText={setTotalKms} keyboardType="numeric" />
            <CustomInput placeholder="Total" value={total} onChangeText={setTotal} keyboardType="numeric" />

            {/* Update Button */}
            <TouchableOpacity style={styles.updateButton} onPress={handleViewTripUpdate}>
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
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



