import React, { memo, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import Background from '../components/background';
import Button from '../components/button';
import { theme } from '../theme';
import { Navigation } from '../types';
import { List, Avatar } from 'react-native-paper';
import ScrollView from '../components/scroll-view';
import { retrieveData, postData, resetNavigatorStack } from '../util';
import * as Contacts from 'expo-contacts';

type Props = {
    navigation: Navigation;
};

const ContactItem = ({ name, number, image, toggle, id }) => {
    const [invited, setInvited] = useState(false);
    return (
        <List.Item
            style={styles.item}
            title={name}
            description={number}
            onPress={() => {toggle(id); setInvited(!invited);}}
            left={() => image ? <Avatar.Image source={{uri: image.uri}} size={32} style={{margin: 16}} /> : <Avatar.Icon color={theme.colors.secondary} icon="account-circle" style={{backgroundColor: theme.colors.background}} />}
            right={() => invited ? <Avatar.Icon color={theme.colors.primary} icon="check-circle" style={{backgroundColor: theme.colors.background}} /> : null}
        />
    );
};

const FriendItem = ({ firstname, lastname, username, toggle, id }) => {
    const [invited, setInvited] = useState(false);
    return (
        <List.Item
            style={styles.item}
            title={firstname + ' ' + lastname}
            description={username}
            onPress={() => {toggle(id); setInvited(!invited);}}
            left={() => <Avatar.Icon color={theme.colors.secondary} icon="account-circle" style={{backgroundColor: theme.colors.background}} />}
            right={() => invited ? <Avatar.Icon color={theme.colors.primary} icon="check-circle" style={{backgroundColor: theme.colors.background}} /> : null}
        />
    );
};

const ParticipantsScreen = ({ navigation }: Props) => {
    const [friends, setFriends] = useState([]);
    const [phoneContacts, setPhoneContacts] = useState([]);
    const [errorText, setErrorText] = useState('');
    const contacts = useRef({});
    
    const toggle = (key: string) => contacts.current[key].invited = !(contacts.current[key].invited);

    const _onInvitePressed = () => {
        postData('/inviteEvent', {
            oid: navigation.getParam('oid'),
            users: Object.keys(contacts.current).filter(key => contacts.current[key].invited).map(key => {
                let obj = contacts.current[key];
                if (obj.hasOwnProperty('username')) {
                    return ({username: obj.username});
                } else {
                    return ({phone: obj.phone});
                }
            }),
        })
        .then(data => {
            if (data.status == 'success') {
                resetNavigatorStack(navigation, 'Dashboard');
            } else {
                setErrorText(data.message);
            }
        });
    };
    
    useEffect(() => {
        retrieveData('username').then(username => postData('/getFriends', {username}))
        .then(data => {
            let friendItems = [];
            data.friends.filter(friend => !friend.hasOwnProperty('status') || friend.status == 'accepted')
            .forEach(({username, firstname, lastname}) => {
                contacts.current[username] = {
                    username,
                    invited: false,
                };
                friendItems.push((<FriendItem username={username} firstname={firstname} lastname={lastname} id={username} key={username} toggle={toggle} />));
            });
            setFriends(friendItems);
        });
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [
                        Contacts.Fields.Name,
                        Contacts.Fields.PhoneNumbers,
                        Contacts.Fields.Image
                    ],
                });
    
                if (data.length > 0) {
                    let numbers = [];
                    data.forEach(({name, image, phoneNumbers}) => {
                        if (phoneNumbers) {
                            phoneNumbers.forEach(({id, digits}) => {
                                if (digits.length >= 10) {
                                    contacts.current[id] = {
                                        phone: digits,
                                        invited: false
                                    };
                                    numbers.push((<ContactItem name={name} number={digits} image={image} toggle={toggle} id={id} key={id} />));
                                }
                            });
                        }
                    });
                    setPhoneContacts(numbers);
                }
            }
        })();
    }, []);

    return (
        <Background>
            <ScrollView>
                {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
                {friends.length > 0 &&
                    <List.Section style={styles.list} title="Select friends to invite">
                        {friends}
                    </List.Section>
                }
                {phoneContacts.length > 0 &&
                    <List.Section style={styles.list} title="Select phone contacts to invite">
                        {phoneContacts}
                    </List.Section>
                }
            </ScrollView>
            <Button mode="contained" onPress={_onInvitePressed} style={styles.button}>
                Invite
            </Button>
        </Background>
    );
};

const styles = StyleSheet.create({
    button: {
        marginBottom: 32,
    },
    list: {
        width: '100%',
    },
    item: {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.secondary,
        borderBottomWidth: 0.25,
        padding: 5,
        margin: 1,
    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 4,
    },
});

export default memo(ParticipantsScreen);