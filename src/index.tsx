import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {
    LoginScreen,
    RegisterScreen,
    Dashboard,
    CreateEventScreen,
    ParticipantsScreen,
    ProfileScreen,
    DetailsScreen,
    SearchScreen,
} from './screens';
import { Platform } from 'react-native';
import { theme } from './theme';
import LogoutButton from './components/logout-button';
import SkipButton from './components/skip-button';
import { Appbar } from 'react-native-paper';

const Router = createStackNavigator(
    {
        LoginScreen,
        RegisterScreen,
        Dashboard: {screen: Dashboard, navigationOptions: {title: "Let's Hang"}},
        CreateEventScreen: {screen: CreateEventScreen, navigationOptions: {title: "Create New Event"}},
        ParticipantsScreen: {screen: ParticipantsScreen, navigationOptions: {title: "Invite Friends"}},
        ProfileScreen: {screen: ProfileScreen, navigationOptions: {title: "User Profile"}},
        DetailsScreen: {screen: DetailsScreen, navigationOptions: {title: "Event Details"}},
        SearchScreen: {screen: SearchScreen, navigationOptions: {title: "Search"}},
    },
    {
        initialRouteName: 'LoginScreen',
        headerMode: Platform.select({ios: 'float', android: 'screen'}),
        defaultNavigationOptions: {
            header: ({scene, previous, navigation}) => {
                const { options } = scene.descriptor;
                const title =
                    navigation.getParam('title', undefined) !== undefined
                    ? navigation.getParam('title')
                    : options.headerTitle !== undefined
                    ? options.headerTitle
                    : options.title !== undefined
                    ? options.title
                    : '';
                return (
                    <Appbar.Header>
                        {previous ? <Appbar.BackAction onPress={() => navigation.goBack()} color={theme.colors.background} /> : null}
                        <Appbar.Content title={title} color={theme.colors.background} />
                        {scene.route.routeName == 'Dashboard' ? <Appbar.Action icon="account" color={theme.colors.background} onPress={() => navigation.navigate('ProfileScreen')} /> : null}
                        {scene.route.routeName == 'Dashboard' ? <Appbar.Action icon="magnify" color={theme.colors.background} onPress={() => navigation.navigate('SearchScreen')} /> : null}
                        {scene.route.routeName == 'Dashboard' || scene.route.routeName == 'ProfileScreen' ? <LogoutButton/> : null}
                        {scene.route.routeName == 'ParticipantsScreen' ? <SkipButton/> : null}
                    </Appbar.Header>)
            },
        },
    }
);

export default createAppContainer(Router);