import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {
    LoginScreen,
    RegisterScreen,
    Dashboard,
    CreateEventScreen,
} from './screens';
import { Platform } from 'react-native';
import { theme } from './theme';

const Router = createStackNavigator(
    {
        LoginScreen: {screen: LoginScreen, navigationOptions: {title: "Login"}},
        RegisterScreen: {screen: RegisterScreen, navigationOptions: {title: "Sign Up"}},
        Dashboard: {screen: Dashboard, navigationOptions: {title: "Let's Hang"}},
        CreateEventScreen: {screen: CreateEventScreen, navigationOptions: {title: "Create New Event"}},
    },
    {
        initialRouteName: 'LoginScreen',
        headerMode: Platform.select({ios: 'float', android: 'screen'}),
        defaultNavigationOptions: {
            headerStyle: {backgroundColor: theme.colors.primary},
            headerTitleStyle: {color: theme.colors.surface},
            headerBackTitleVisible: false,
            headerTintColor: theme.colors.surface,
        },
    }
);

export default createAppContainer(Router);