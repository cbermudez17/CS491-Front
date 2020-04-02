import React, { memo, useState, useEffect } from 'react';
import { Text } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Background from '../components/background';
import Card from '../components/card';
import CardDeck from '../components/card-deck';
import { Navigation, Event } from '../types';
import { FAB } from 'react-native-paper';
import { Alert, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { postData } from '../util';

type Props = {
    navigation: Navigation;
};

const DashboardScreen = ({ navigation }: Props) => {
    const [myEvents, setMyEvents] = useState([]);
    const [invitedEvents, setInvitedEvents] = useState([]);
    const [globalEvents, setGlobalEvents] = useState([]);

    const localizeDate = (date: string, time: string) => {
        let d = new Date(date.substring(5)+'/'+date.substr(0, 4));
        d.setHours(parseInt(time.substr(0,2)));
        d.setMinutes(parseInt(time.substr(3)));
        return d.toLocaleString();
    };

    useEffect(() => {
        postData('http://24.190.49.248:8000/getEvents', {username: 'wjmccann'})
        .then(data => {
            setMyEvents(data.mine.map((event: Event) => (
                <Card key={event.username+event.name} title={event.name} location={event.location} date={localizeDate(event.date, event.time)} host={event.username}>
                    <Text>This is the description placeholder for {event.name}.</Text>
                </Card>)
            ));
            setInvitedEvents(data.friends.map((event: Event) => (
                <Card key={event.username+event.name} title={event.name} location={event.location} date={localizeDate(event.date, event.time)} host={event.username}>
                    <Text>This is the description placeholder for {event.name}. Invitation status: {event.status}</Text>
                </Card>)
            ));
            setGlobalEvents([]);
        });
    }, []);

    return (
    <Background>
        <ScrollableTabView
            style={{ marginTop: 20 }}
            tabBarActiveTextColor={theme.colors.primary}
            tabBarUnderlineStyle={{backgroundColor: theme.colors.primary}}
        >
            <CardDeck tabLabel='My Events'>{myEvents.length > 0 ? myEvents : <Text>You have no events. Why don't you create one?</Text>}</CardDeck>
            <CardDeck tabLabel='Invited To'>{invitedEvents.length > 0 ? invitedEvents : <Text>Looks like there's no invitations to any events.</Text>}</CardDeck>
            <CardDeck tabLabel='Public Events'>{globalEvents.length > 0 ? globalEvents : <Text>Looks like there's nothing happening in your area.</Text>}</CardDeck>
        </ScrollableTabView>
        <FAB style={styles.fab} icon="plus" onPress={() => Alert.alert('Pressed')} />
    </Background>
)};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,        
        right: -15,
        bottom: 0,
        backgroundColor: theme.colors.primary,
    },
})

export default memo(DashboardScreen);