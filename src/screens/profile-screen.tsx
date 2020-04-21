import React, { memo, useState, useEffect } from 'react';
import { View } from 'react-native';
import Background from '../components/background';
import { Navigation } from '../types';
import { Avatar, Chip } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { theme } from '../theme';
import { postData, retrieveData } from '../util';
import ScrollView from '../components/scroll-view';

type Props = {
    navigation: Navigation;
};

const ProfileScreen = ({ navigation }: Props) => {
    const [isSelf, setIsSelf] = useState(false);
    const [friendStatus, setFriendStatus] = useState('none');
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [friendsCount, setFriendsCount] = useState(0);

    useEffect(() => {
        retrieveData('username')
        .then(selfUser => {
            let user = navigation.getParam('username', undefined);
            if (user == undefined) {
                // Looking at your own profile
                user = selfUser;
                setIsSelf(true);
            } else {
                // Looking at another user's profile
                setIsSelf(false);
                postData('http://24.190.49.248:8000/getFriends', {username: selfUser})
                .then(data => {
                    let friends = data.friends.filter(friend => friend.username == user);
                    setFriendStatus(friends.length == 0 ? 'none' : friends[0].status);
                });
            }
            postData('http://24.190.49.248:8000/checkUserExists', {username: user})
            .then(data => {
                if (data.status == 'success') {
                    setUsername(data.username);
                    setFirstname(data.firstname);
                    setLastname(data.lastname);
                    postData('http://24.190.49.248:8000/getFriends', {username: user})
                    .then(data => setFriendsCount(data.friends.filter(friend => friend.status == 'accepted').length));
                }
            });
        });
    }, [username]);

    const _addFriend = async () => {
        postData('http://24.190.49.248:8000/friendRequest', {user: {username: await retrieveData('username')}, request: {username}})
        .then(data => {
            if (data.status == 'success') {
                setFriendStatus('pending');
            }
        });
    };

    const _removeFriend = async () => {
        postData('http://24.190.49.248:8000/updateFriendRequest', {user: {username: await retrieveData('username')}, request: {username}, type: 'reject'})
        .then(data => {
            if (data.status == 'success') {
                setFriendStatus('none');
                setFriendsCount(friendsCount - 1);
            }
        });
    };

    const _accept = async () => {
        postData('http://24.190.49.248:8000/updateFriendRequest', {user: {username: await retrieveData('username')}, request: {username}, type: 'accept'})
        .then(data => {
            if (data.status == 'success') {
                setFriendStatus('accepted');
                setFriendsCount(friendsCount + 1);
            }
        });
    };

    const _reject = async () => {
        postData('http://24.190.49.248:8000/updateFriendRequest', {user: {username: await retrieveData('username')}, request: {username}, type: 'reject'})
        .then(data => {
            if (data.status == 'success') {
                setFriendStatus('none');
            }
        });
    };

    return (
    <Background>
        <ScrollView>
            <Avatar.Text style={{marginBottom: 20}} size={140} label={firstname.length == 0 ? 'N/A' : firstname.charAt(0) + lastname.charAt(0)} />
            {!isSelf && friendStatus == 'waiting' &&
                <View style={styles.chipGroup}>
                    <Chip mode="outlined" textStyle={styles.white} style={[styles.chip, styles.greenChip, {marginRight: 5}]} icon="account-check" onPress={_accept}>Accept</Chip>
                    <Chip mode="outlined" textStyle={styles.white} style={[styles.chip, styles.redChip]} icon="account-remove" onPress={_reject}>Reject</Chip>
                </View>}
            {!isSelf && friendStatus == 'accepted' &&
                <Chip mode="outlined" textStyle={styles.white} style={[styles.chip, styles.redChip]} icon="account-minus" onPress={_removeFriend}>Remove Friend</Chip>}
            {!isSelf && friendStatus == 'pending' &&
                <Chip mode="outlined" textStyle={styles.white} style={[styles.chip, {backgroundColor: '#808080'}]} icon="account-clock">Request Pending</Chip>}
            {!isSelf && friendStatus == 'none' &&
                <Chip mode="outlined" textStyle={styles.white} style={[styles.chip, styles.greenChip]} icon="account-plus" onPress={_addFriend}>Add Friend</Chip>}
            <Chip mode="outlined" textStyle={{color: theme.colors.onBackground}} style={[styles.chip, {backgroundColor: theme.colors.background}]} icon="account-multiple">{friendsCount} Friends</Chip>
        </ScrollView>
    </Background>
)};

const styles = StyleSheet.create({
    chipGroup: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    greenChip: {
        backgroundColor: '#090',
    },
    redChip: {
        backgroundColor: '#c00',
    },
    chip: {
        marginBottom: 20,
    },
    white: {
        color: '#fff',
    },
});

export default memo(ProfileScreen);