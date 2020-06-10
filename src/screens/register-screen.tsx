import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Background from '../components/background';
import Logo from '../components/logo';
import Header from '../components/header';
import Button from '../components/button';
import TextInput from '../components/text-input';
import ScrollView from '../components/scroll-view';
import { theme } from '../theme';
import { Navigation } from '../types';
import {
    emailValidator,
    passwordValidator,
    usernameValidator,
    telephoneValidator,
    postData,
    resetNavigatorStack,
    storeData,
    emptyValidator,
} from '../util';

type Props = {
    navigation: Navigation;
};

const RegisterScreen = ({ navigation }: Props) => {
    const [errorText, setErrorText] = useState('');
    const [firstname, setFirstName] = useState({ value: '', error: '' });
    const [lastname, setLastName] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });
    const [username, setUsername] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [phone, setPhone] = useState({ value: '', error: '' });

    const _onSignUpPressed = () => {
        const firstnameError = emptyValidator(firstname.value, 'First name');
        const lastnameError = emptyValidator(lastname.value, 'Last name');
        const usernameError = usernameValidator(username.value);
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);
        const phoneError = telephoneValidator(phone.value);

        if (emailError || usernameError || passwordError || firstnameError || lastnameError || phoneError) {
            setFirstName({ ...firstname, error: firstnameError });
            setLastName({ ...lastname, error: lastnameError });
            setEmail({ ...email, error: emailError });
            setUsername({ ...username, error: usernameError });
            setPassword({ ...password, error: passwordError });
            setPhone({ ...phone, error: phoneError });
            return;
        }

        postData('/register', {
            firstname: firstname.value,
            lastname: lastname.value,
            username: username.value,
            email: email.value,
            password: password.value,
            phone: phone.value
        })
        .then(data => {
            if (data.status == 'success') {
                storeData('username', username.value);
                storeData('firstname', firstname.value);
                storeData('lastname', lastname.value);
                resetNavigatorStack(navigation, 'Dashboard');
            } else {
                setErrorText(data.message);
            }
        });
    };

    return (
        <Background>
            <ScrollView>
                <Logo />
                <Header>Create Account</Header>
                {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
                <TextInput
                    label="First Name"
                    returnKeyType="next"
                    value={firstname.value}
                    onChangeText={text => setFirstName({ value: text, error: '' })}
                    error={!!firstname.error}
                    errorText={firstname.error}
                />
                <TextInput
                    label="Last Name"
                    returnKeyType="next"
                    value={lastname.value}
                    onChangeText={text => setLastName({ value: text, error: '' })}
                    error={!!lastname.error}
                    errorText={lastname.error}
                />
                <TextInput
                    label="Username"
                    returnKeyType="next"
                    value={username.value}
                    onChangeText={text => setUsername({ value: text, error: '' })}
                    error={!!username.error}
                    errorText={username.error}
                />
                <TextInput
                    label="Email"
                    returnKeyType="next"
                    value={email.value}
                    onChangeText={text => setEmail({ value: text, error: '' })}
                    error={!!email.error}
                    errorText={email.error}
                    autoCapitalize="none"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                />
                <TextInput
                    label="Password"
                    returnKeyType="next"
                    value={password.value}
                    onChangeText={text => setPassword({ value: text, error: '' })}
                    error={!!password.error}
                    errorText={password.error}
                    secureTextEntry
                />
                <TextInput
                    label="Phone"
                    returnKeyType="done"
                    value={phone.value}
                    onChangeText={text => setPhone({ value: text, error: '' })}
                    error={!!phone.error}
                    errorText={phone.error}
                    autoCompleteType="tel"
                    textContentType="telephoneNumber"
                    keyboardType="phone-pad"
                />
                <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}>
                    Sign Up
                </Button>
                <View style={styles.row}>
                    <Text style={styles.label}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                        <Text style={styles.link}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Background>
    );
};

const styles = StyleSheet.create({
    label: {
        color: theme.colors.secondary,
    },
    button: {
        marginTop: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 4,
    },
});

export default memo(RegisterScreen);