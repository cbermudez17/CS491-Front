import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Background from '../components/background';
import Button from '../components/button';
import TextInput from '../components/text-input';
import { theme } from '../theme';
import { Navigation } from '../types';
import { postData, retrieveData, resetNavigatorStack, emptyValidator } from '../util';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Switch, Caption } from 'react-native-paper';
import { Platform } from 'react-native';
import ScrollView from '../components/scroll-view';

type Props = {
    navigation: Navigation;
};

const CreateEventScreen = ({ navigation }: Props) => {
    const [eventName, setEventName] = useState({ value: '', error: '' });
    const [description, setDescription] = useState({ value: '', error: '' });
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [location, setLocation] = useState({ value: '', error: '' });
    const [showMap, setShowMap] = useState(true);
    const [marker, setMarker] = useState({latitude: 40.7418, longitude: -74.1787});
    const [isPublic, setPublic] = useState(false);
    
    const extractLocalTime = (time: Date) => {
        let t = time.toLocaleTimeString();
        if (Platform.OS === 'ios') {
            let end = t.lastIndexOf(':');
            return t.substring(0, end) + t.substr(t.length - 2);
        } else {
            let timeParts = t.split(':');
            let hours = parseInt(timeParts[0]);
            let minutes = timeParts[1];
            if (hours == 0) {
                return '12:' + minutes + 'AM';
            } else if (hours < 12) {
                return hours + ':' + minutes + 'AM';
            } else if (hours == 12) {
                return '12:' + minutes + 'PM';
            } else {
                return (hours-12) + ':' + minutes + 'PM';
            }
        }
    };

    const extractUTCTime = (time: Date) => {
        let hours = time.getUTCHours().toString();
        let minutes = time.getUTCMinutes().toString();
        if (hours.length < 2) {
            hours = '0' + hours;
        }
        if (minutes.length < 2) {
            minutes = '0' + minutes;
        }
        return hours + ':' + minutes;
    };

    const extractUTCDate = (date: Date, time: Date) => {
        let d = new Date(date.getTime());
        d.setHours(time.getHours());
        d.setMinutes(time.getMinutes());
        let year = d.getUTCFullYear().toString();
        let month = (d.getUTCMonth() + 1).toString();
        if (month.length < 2) {
            month = '0' + month;
        }
        let day = d.getUTCDate().toString();
        if (day.length < 2) {
            day = '0' + day;
        }
        return [year, month, day].join('/');
    };

    const toggleDatePicker = () => setShowDate(!showDate);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDate(Platform.OS === 'ios');
        setDate(currentDate);
        if (Platform.OS === 'ios') {
            setTime(currentDate);
        }
    };

    const onTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTime(false);
        setTime(currentTime);
    };

    const _onCreatePressed = () => {
        const eventNameError = emptyValidator(eventName.value, 'Event name');
        const descriptionError = emptyValidator(description.value, 'Description');
        const locationError = emptyValidator(location.value, 'Location');

        if (eventNameError || locationError) {
            setEventName({ ...eventName, error: eventNameError });
            setLocation({ ...location, error: locationError });
            return;
        }

        let username = retrieveData('username');
        let firstname = retrieveData('firstname');
        let lastname = retrieveData('lastname');

        postData('http://24.190.49.248:8000/createEvent', {
            name: eventName.value,
            username,
            firstname,
            lastname,
            description: description.value,
            location: showMap ? {name: location.value, latitude: marker.latitude, longitude: marker.longitude} : {name: location.value},
            participants: [],
            date: extractUTCDate(date, time),
            time: extractUTCTime(time),
            type: isPublic ? 'public' : 'private',
        })
        .then(data => resetNavigatorStack(navigation, 'ParticipantsScreen', {oid: data["_id"]["$oid"]}));
    };

    return (
        <Background>
            <ScrollView>
                <TextInput
                    label="Event Name"
                    returnKeyType="next"
                    value={eventName.value}
                    onChangeText={text => setEventName({ value: text, error: '' })}
                    error={!!eventName.error}
                    errorText={eventName.error}
                />
                <TextInput
                    label="Description"
                    returnKeyType="next"
                    value={description.value}
                    onChangeText={text => setDescription({ value: text, error: '' })}
                    multiline={true}
                />
                <View style={styles.container}>
                    <Button mode="text" onPress={toggleDatePicker}>{Platform.OS === 'ios' ? date.toLocaleDateString() + ' ' + extractLocalTime(time) : date.toLocaleDateString()}</Button>
                    {Platform.OS === 'ios' ? null : <Button mode="text" onPress={() => setShowTime(true)}>{extractLocalTime(time)}</Button>}
                    {showDate &&
                        (<DateTimePicker
                            value={date}
                            mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
                            minimumDate={new Date()}
                            onChange={onDateChange}
                        />
                    )}
                    {showTime &&
                        (<DateTimePicker
                            value={time}
                            mode="time"
                            is24Hour={true}
                            minimumDate={new Date()}
                            display="spinner"
                            onChange={onTimeChange}
                        />
                    )}
                </View>
                <TextInput
                    label="Location"
                    returnKeyType="next"
                    value={location.value}
                    onChangeText={text => setLocation({ value: text, error: '' })}
                    error={!!location.error}
                    errorText={location.error}
                />
                <View style={styles.switchContainer}>
                    <Caption style={styles.switchCaption}>Select On Map</Caption>
                    <Switch
                        value={showMap}
                        onValueChange={setShowMap}
                        color={theme.colors.primary}
                        style={styles.switch}
                    />
                </View>
                {showMap &&
                    (<View style={styles.container}>
                        <MapView
                            style={styles.mapStyle}
                            provider="google"
                            showsUserLocation={true}
                            initialRegion={{latitude: 40.7418, longitude: -74.1787, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}
                            onLongPress={e => setMarker(e.nativeEvent.coordinate)}
                        >
                            <Marker coordinate={marker} onDragEnd={e => setMarker(e.nativeEvent.coordinate)} draggable />
                        </MapView>
                    </View>
                )}
                <View style={styles.switchContainer}>
                    <Caption style={styles.switchCaption}>Public Event</Caption>
                    <Switch
                        value={isPublic}
                        onValueChange={setPublic}
                        color={theme.colors.primary}
                        style={styles.switch}
                    />
                </View>
                <Button mode="contained" onPress={_onCreatePressed} style={styles.button}>
                    Create Event
                </Button>
            </ScrollView>
        </Background>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    mapStyle: {
        width: 300,
        height: 300,
        marginVertical: 20
    },
    switchContainer: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 15,
    },
    switchCaption: {
        fontSize: 18,
        textAlignVertical: 'center',
        flex:1,
    },
    switch: {
        flex: 1,
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