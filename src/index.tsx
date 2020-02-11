import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { HomeScreen, LoginScreen } from './screens';

const Router = createStackNavigator(
    {
        HomeScreen,
        LoginScreen
    },
    {
        initialRouteName: 'HomeScreen',
        headerMode: 'none',
    }
);

export default createAppContainer(Router);