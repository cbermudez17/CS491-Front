import React, { memo, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
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
import { Switch, Caption } from 'react-native-paper';

type Props = {
    navigation: Navigation;
};

const CreateEventScreen = ({ navigation }: Props) => {
    const [errorText, setErrorText] = useState('');
    const [eventName, setEventName] = useState({ value: '', error: '' });
    const [date, setDate] = useState({ value: '', error: '' });
    const [time, setTime] = useState({ value: '', error: '' });
    const [location, setLocation] = useState('');
    const [isPublic, setPublic] = useState(false);

    const _onCreatePressed = () => {
        const eventNameError = nameValidator(eventName.value);
        const dateError = dateValidator(date.value);
        const timeError = timeValidator(time.value);

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
    };

    return (
        <Background>
            {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
            <TextInput
                label="Event Name"
                returnKeyType="next"
                value={eventName.value}
                onChangeText={text => setEventName({ value: text, error: '' })}
                error={!!eventName.error}
                errorText={eventName.error}
            />
            <View style={{width:'100%', flexDirection:"row",}}>
                <Caption style={{fontSize:18,textAlignVertical:'center',flex:1}}>Public Event</Caption>
                <Switch
                    value={isPublic}
                    onValueChange={setPublic}
                    color={theme.colors.primary}
                    style={{flex:1}}
                />
            </View>
            <TextInput
                label="Date"
                returnKeyType="next"
                value={date.value}
                onChangeText={text => setDate({ value: text, error: '' })}
                error={!!date.error}
                errorText={date.error}
            />
            <TextInput
                label="Time"
                returnKeyType="next"
                value={time.value}
                onChangeText={text => setTime({ value: text, error: '' })}
                error={!!time.error}
                errorText={time.error}
            />
            <TextInput
                label="Location"
                returnKeyType="next"
                value={location}
                onChangeText={setLocation}
            />
            <Button mode="contained" onPress={_onCreatePressed} style={styles.button}>
                Create Event
            </Button>
        </Background>
    );
};

const styles = StyleSheet.create({
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