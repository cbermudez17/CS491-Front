import React, { memo } from 'react';
import { Navigation } from '../types';
import { Appbar } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import { theme } from '../theme';
import { removeData, resetNavigatorStack } from '../util';

type Props = {
    navigation?: Navigation;
};

const _onLogoutPressed = (navigation: Navigation) => {
    removeData('username', 'firstname', 'lastname');
    resetNavigatorStack(navigation, 'LoginScreen');
};

const LogoutButton = ({ navigation }: Props) => (<Appbar.Action icon="logout-variant" color={theme.colors.background} onPress={() => _onLogoutPressed(navigation)} />);

export default memo(withNavigation(LogoutButton));