import React, { memo } from 'react';
import { Navigation } from '../types';
import { Button } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import { theme } from '../theme';
import { resetNavigatorStack } from '../util';

type Props = {
    navigation?: Navigation;
};

const SkipButton = ({ navigation }: Props) => (<Button mode="text" color={theme.colors.surface} onPress={() => resetNavigatorStack(navigation, 'Dashboard')}>Skip</Button>);

export default memo(withNavigation(SkipButton));