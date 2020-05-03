import React, { memo, useState, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Background from '../components/background';
import Button from '../components/button';
import { theme } from '../theme';
import { Navigation } from '../types';
import { List } from 'react-native-paper';
import ScrollView from '../components/scroll-view';
import { retrieveData, postData, resetNavigatorStack } from '../util';

type Props = {
    navigation: Navigation;
};

const ParticipantsScreen = ({ navigation }: Props) => {
    const [contacts, setContacts] = useState([]);
    const [errorText, setErrorText] = useState('');
    
    const _onInvitePressed = () => {
        postData('http://24.190.49.248:8000/inviteEvent', {
            oid: navigation.getParam('oid'),
            users: contacts.filter(contact => contact.invited).map(contact => ({username: contact.username})),
        })
        .then(data => {
            if (data.status == 'success') {
                resetNavigatorStack(navigation, 'Dashboard');
            } else {
                setErrorText(data.message);
            }
        });
    };
    
    const toggleParticipant = (username: string) =>
        setContacts(contacts.map((contact) => {
            if (contact.username == username) {
                contact.invited = !contact.invited;
            }
            return contact;
        }));
    
    useEffect(() => {
        retrieveData('username').then(username => postData('http://24.190.49.248:8000/getFriends', {username}))
        .then(data => {
            setContacts(data.friends.filter(friend => !friend.hasOwnProperty('status') || friend.status == 'accepted')
            .map(friend => ({username: friend.username, firstname: friend.firstname, lastname: friend.lastname, invited: false})));
        });
    }, []);

    const listItems = contacts.map(contact => (
        <List.Item
            style={styles.item}
            title={contact.firstname + ' ' + contact.lastname}
            description={contact.username}
            onPress={() => toggleParticipant(contact.username)}
            key={contact.username}
            left={() => <List.Icon color={theme.colors.secondary} icon="account-circle" />}
            right={() => contact.invited ? <List.Icon color={theme.colors.primary} icon="check-circle" /> : null}
        />
    ));

    return (
        <Background>
            <ScrollView>
                {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
                <List.Section style={styles.list} title="Select friends to invite">
                    {listItems}
                </List.Section>
                <Button mode="contained" onPress={_onInvitePressed} style={styles.button}>
                    Invite
                </Button>
            </ScrollView>
        </Background>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 24,
    },
    list: {
        width: '100%',
    },
    item: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.secondary,
        borderBottomWidth: 0.25,
        padding: 0,
    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 4,
    },
});

export default memo(ParticipantsScreen);