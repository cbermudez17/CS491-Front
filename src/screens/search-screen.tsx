import React, { memo, useState } from 'react';
import { StyleSheet } from 'react-native';
import Background from '../components/background';
import { theme } from '../theme';
import { Navigation } from '../types';
import { List, Searchbar } from 'react-native-paper';
import ScrollView from '../components/scroll-view';
import { postData } from '../util';

type Props = {
    navigation: Navigation;
};

const SearchScreen = ({ navigation }: Props) => {
    const [contacts, setContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const mapUserToResult = (username: string) => (
        <List.Item
            style={styles.item}
            title={username}
            onPress={() => navigation.navigate('ProfileScreen', {username, title: username.toUpperCase()})}
            key={username}
            left={() => <List.Icon color={theme.colors.secondary} icon="account-circle" />}
        />
    );

    const _onChangeSearch = (text: string) => {
        setSearchQuery(text);
        if (text.trim().length > 2) {
            postData('http://24.190.49.248:8000/searchUsername', {username: text.trim()})
            .then(data => setContacts(data.usernames.map(mapUserToResult)));
        } else {
            setContacts([]);
        }
    };

    return (
        <Background>
            <ScrollView>
                <Searchbar
                    placeholder="Search username"
                    onChangeText={_onChangeSearch}
                    value={searchQuery}
                    style={styles.search}
                />
                <List.Section style={styles.list}>
                    {contacts}
                </List.Section>
            </ScrollView>
        </Background>
    );
};

const styles = StyleSheet.create({
    list: {
        width: '100%',
    },
    item: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.secondary,
        borderBottomWidth: 0.25,
        padding: 0,
    },
    search: {
        borderColor: theme.colors.secondary,
        borderWidth: 0.25,
    },
});

export default memo(SearchScreen);