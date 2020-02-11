import React, { memo } from 'react';
import Background from '../components/background';
import Logo from '../components/logo';
import Header from '../components/header';
import Button from '../components/button';
import Paragraph from '../components/paragraph';
import { Navigation } from '../types';

type Props = {
  navigation: Navigation;
};

const HomeScreen = ({ navigation }: Props) => (
  <Background>
    <Logo />
    <Header>Let's Hang</Header>
    <Paragraph>
      The easiest way to start hanging out with friends or meet new ones.
    </Paragraph>
    <Button mode="contained" onPress={() => navigation.navigate('LoginScreen')}>
      Login
    </Button>
    <Button mode="outlined" onPress={() => navigation.navigate('RegisterScreen')}>
      Sign Up
    </Button>
  </Background>
);

export default memo(HomeScreen);