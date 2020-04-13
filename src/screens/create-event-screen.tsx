import React, { memo, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Modal } from 'react-native-paper';
import Background from '../components/background';
import Button from '../components/button';
import TextInput from '../components/text-input';
import { theme } from '../theme';
import { Navigation } from '../types';
import {
    nameValidator,
    dateValidator,
    timeValidator,
    postData,
} from '../util';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Switch, Caption } from 'react-native-paper';
import { Platform } from 'react-native';

type Props = {
    navigation: Navigation;
};

const CreateEventScreen = ({ navigation }: Props) => {
    const [errorText, setErrorText] = useState('');
    const [eventName, setEventName] = useState({ value: '', error: '' }); 
    const [location, setLocation] = useState('');
    const [isPublic, setPublic] = useState(false);

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [time, setTime] = useState({ value: '' });

    const showDatePicker = () => {
        if (show === false)
            showMode('date');
        else
            setShow(false);

    };

    const showTimePicker = () => {
        if (show === false)
            showMode('time');
        else
            setShow(false);
    };

    const showMode = currentMode => {
        setShow(true);
        setMode(currentMode);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;

        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const _onCreatePressed = () => {
        const eventNameError = nameValidator(eventName.value);

        if (eventNameError) {
            setEventName({ ...eventName, error: eventNameError });
            return;
        }
        /*
        if (eventNameError || dateError || timeError) {
            setEventName({ ...eventName, error: eventNameError });
            setDate({ ...date, error: dateError });
            setTime({ ...time, error: timeError });
            return;
        }
        
        postData('http://24.190.49.248:8000/createEvent', {
            name: eventName.value,
            username: 'wjmccann',
            firstname: "first name",
            lastname: "last name",
            location: { lat: 7, lng: 7 },
            participants: [],
            date: date.value,
            time: time.value,
            type: isPublic ? 'public' : 'private',
        })
        .then(data => {
            if (data.status == 'success') {
                navigation.navigate('Dashboard');
            } else {
                setErrorText(data.message);
            }
        });
        */

    };

    return (

        <Background >
            <View style={styles.container}>
                {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
                <TextInput
                    label="Event Name"
                    returnKeyType="next"
                    value={eventName.value}
                    onChangeText={text => setEventName({ value: text, error: '' })}
                    error={!!eventName.error}
                    errorText={eventName.error}
                />

                <View style={styles.container}>
                    <Button mode="text" onPress={showTimePicker}>Select event time</Button>
                    <Button mode="text" onPress={showDatePicker}>Select date</Button>
                    {show &&
                        (<DateTimePicker
                            testID="dateTimePicker"
                            timeZoneOffsetInMinutes={0}
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                        )}
                </View>

                <TextInput
                    label="Location"
                    returnKeyType="next"
                    value={location}
                    onChangeText={setLocation}
                />

                <View style={{ width: '100%', flexDirection: "row", }}>
                    <Caption style={{ fontSize: 18, textAlignVertical: 'center', flex: 1 }}>Public Event</Caption>
                    <Switch
                        value={isPublic}
                        onValueChange={setPublic}
                        color={theme.colors.primary}
                        style={{ flex: 1 }}
                    />
                </View>
                <Button mode="contained" onPress={_onCreatePressed} style={styles.button}>
                    Create Event
            </Button>
            </View>
        </Background>

    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    label: {
        color: theme.colors.secondary,
    },
    button: {
        marginTop: 24,
    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 4,
    },
});

export default memo(CreateEventScreen);