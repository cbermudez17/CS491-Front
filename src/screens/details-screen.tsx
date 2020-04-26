import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Background from '../components/background';
import Button from '../components/button';
import { theme } from '../theme';
import { Navigation, Event } from '../types';
import { retrieveData, localizeDate } from '../util';
import { Subheading, Headline } from 'react-native-paper';
import ScrollView from '../components/scroll-view';

type Props = {
    navigation: Navigation;
};

const DetailsScreen = ({ navigation }: Props) => {
    const event: Event = JSON.parse(navigation.getParam('event'));
    const [username, setUsername] = useState('');
    retrieveData('username').then(setUsername);

    return (
        <Background>
            <ScrollView>
                <Headline style={{padding: 20}}>{event.name}</Headline>
                <View style={{alignContent: 'flex-start', width: '100%', marginBottom: 20}}>
                    <Subheading style={{marginBottom: 20}}>{event.description}</Subheading>
                    <Subheading style={{justifyContent: 'flex-start'}}>{'Where: ' + event.location.name}</Subheading>
                    <Subheading>{'When: ' + localizeDate(event.date, event.time)}</Subheading>
                    <View style={{flexDirection: 'row'}}>
                        <Subheading>Host: </Subheading>
                        <Subheading style={{color: theme.colors.link}} onPress={() => navigation.navigate('ProfileScreen', {title: event.username.toUpperCase(), username: event.username})}>{event.username}</Subheading>
                    </View>
                </View>
                {event.location.hasOwnProperty('latitude') && <View style={styles.mapContainer}>
                    <MapView
                        style={styles.mapStyle}
                        provider="google"
                        initialRegion={{latitude: event.location.latitude, longitude: event.location.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}
                    >
                        <Marker coordinate={{latitude: event.location.latitude, longitude: event.location.longitude}} />
                    </MapView>
                </View>}
                {event.username != username && event.hasOwnProperty('status') && event.status == 'invited' &&
                    (<View style={{flexDirection: 'row'}}>
                        <Button mode="contained" style={[styles.button, {backgroundColor: theme.colors.green}]}>
                            Accept
                        </Button>
                        <Button mode="contained" style={[styles.button, {backgroundColor: theme.colors.red}]}>
                            Decline
                        </Button>
                    </View>
                )}
                {event.username != username && event.type == 'public' && !event.participants.some(user => user.username == username) &&
                    (<Button mode="contained" style={styles.button}>
                        Add to my events
                    </Button>
                )}
                {event.username != username && event.type == 'public' && event.participants.some(user => user.username == username) &&
                    (<Button mode="contained" style={styles.button}>
                        Remove from my events
                    </Button>
                )}
                {event.username == username &&
                    (<Button mode="contained" style={styles.button}>
                        Cancel Event
                    </Button>
                )}
            </ScrollView>
        </Background>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    mapContainer: {
        width: '100%',
        alignItems: 'center',
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
        flex: 1,
        marginHorizontal: 5,
    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 4,
    },
});

export default memo(DetailsScreen);