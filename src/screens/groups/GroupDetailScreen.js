import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import AppHeader from '../../components/AppHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { fieldNames } from '../../constants/strings/fieldNames';
import CustomTextInput from '../../components/ui/CustomTextInput';
import { useForm } from 'react-hook-form';

const inputFields = [
    {
        id: 1,
        name: fieldNames.GROUP_NAME,
        placeholder: 'Enter group name',
        fieldType: 'input',
        multiLine: false,
    },
    {
        id: 2,
        name: fieldNames.GROUP_DESCRIPTION,
        placeholder: 'Group Description',
        fieldType: 'input',
        multiLine: true,
    },


]



const GroupDetailScreen = () => {
    const { theme } = useTheme();
    const route = useRoute();
    const { groupId } = route.params;

    const [groupLogo, setGroupLogo] = useState(null);
    const { control, handleSubmit, setValue, reset } = useForm();

    useEffect(() => {

    }, [groupId]);

    const renderField = (item) => {
        return (
            <View key={item.id} style={styles.inputContainer}>
                <CustomTextInput
                    control={control}
                    name={item.name}
                    placeholder={item.placeholder}
                    multiline={item.multiLine}
                    textAlignVertical={item.multiLine ? 'top' : 'center'}
                />
            </View>

        )
    }




    return (
        <View>
            <AppHeader backIcon={true} title={'GroupDetailScreen'} />
            <KeyboardAwareScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.contentContainer,
                    { backgroundColor: theme.backgroundColor },
                ]}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    {groupLogo ? (
                        <Image source={{ uri: groupLogo }} style={styles.groupLogo} />
                    ) : (
                        <View style={[styles.groupLogo, { backgroundColor: '#E0E0E0' }]} />
                    )}
                    {/* <TouchableOpacity style={styles.editButton} onPress={handleEditLogo}>
                        <Ionicons name="camera-outline" size={24} color={theme.textColor} />
                    </TouchableOpacity> */}
                </View>

                {inputFields.map(renderField)}









            </KeyboardAwareScrollView >

        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        padding: 20,
    },
    logoContainer: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    groupLogo: {
        height: 142,
        width: 142,
        borderRadius: 71,
    },
    editButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 8,
        elevation: 4,
    },
    inputContainer: {
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
    },
    createButton: {
        flex: 1,
        marginLeft: 8,
    },
})

export default GroupDetailScreen;
