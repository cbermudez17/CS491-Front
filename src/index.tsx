import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { HomeScreen, LoginScreen, RegisterScreen } from './screens';

const Router = createStackNavigator(
    {
        HomeScreen,
        LoginScreen,
        RegisterScreen,
    },
    {
        initialRouteName: 'HomeScreen',
        headerMode: 'none',
    }
);

export default createAppContainer(Router);