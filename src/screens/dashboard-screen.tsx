import React, { memo, useState, useEffect } from 'react';
import { Text } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Background from '../components/background';
import Card from '../components/card';
import CardDeck from '../components/card-deck';
import { Navigation, Event } from '../types';
import { FAB, Subheading } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { theme } from '../theme';
import { postData, retrieveData } from '../util';

type Props = {
    navigation: Navigation;
};

const DashboardScreen = ({ navigation }: Props) => {
    const [myEvents, setMyEvents] = useState([]);
    const [invitedEvents, setInvitedEvents] = useState([]);
    const [globalEvents, setGlobalEvents] = useState([]);

    const localizeDate = (date: string, time: string) => {
        let year = date.substr(0, 4), month = date.substr(5, 2), day = date.substr(8),
        hour = parseInt(time.substr(0, 2)), minutes = time.substr(3), meridian = 'AM';
        if (hour == 0) {
            hour = 12;
        } else if (hour >= 12) {
            meridian = 'PM';
            if (hour > 12) {
                hour -= 12;
            }
        }
        return `${month}/${day}/${year} ${hour}:${minutes}${meridian}`;
    };

    const eventToCard = (event: Event) => (
        <Card key={event.username+event.name} title={event.name} location={event.location} date={localizeDate(event.date, event.time)} host={event.username}>
            <Text>{event.description}</Text>
        </Card>
    );

    useEffect(() => {
        retrieveData('username').then(username => postData('http://24.190.49.248:8000/getEvents', {username}))
        .then(data => {
            let acceptedEvents = [], notAcceptedEvents = [];
            data.friends.forEach((event: Event) => event.status == 'accepted' ? acceptedEvents.push(event) : notAcceptedEvents.push(event));
            setMyEvents(data.mine.concat(acceptedEvents).map(eventToCard));
            setInvitedEvents(notAcceptedEvents.map(eventToCard));
            setGlobalEvents(data.public.map(eventToCard));
        });
    }, []);

    return (
    <Background>
        <ScrollableTabView
            style={styles.tab}
            tabBarActiveTextColor={theme.colors.primary}
            tabBarUnderlineStyle={{backgroundColor: theme.colors.primary}}
        >
            <CardDeck tabLabel='My Events'>{myEvents.length > 0 ? myEvents : <Subheading>You have no events. Why don't you create one?</Subheading>}</CardDeck>
            <CardDeck tabLabel='Invited To'>{invitedEvents.length > 0 ? invitedEvents : <Subheading>Looks like there's no invitations to any events.</Subheading>}</CardDeck>
            <CardDeck tabLabel='Public Events'>{globalEvents.length > 0 ? globalEvents : <Subheading>Looks like there's nothing happening in your area.</Subheading>}</CardDeck>
        </ScrollableTabView>
        <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate('CreateEventScreen')} />
    </Background>
)};

const styles = StyleSheet.create({
    tab: {
        marginTop: 20,
        flex: 1,
        width: '100%',
    },
    fab: {
        position: 'absolute',
        margin: 16,        
        right: -15,
        bottom: 0,
        backgroundColor: theme.colors.primary,
    },
})

export default memo(DashboardScreen);