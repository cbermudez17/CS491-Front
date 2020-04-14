import { Alert, AsyncStorage } from "react-native";
import { Navigation } from "./types";
import { NavigationActions } from "react-navigation";

export const emailValidator = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    if (!email || email.length <= 0)
        return 'Email cannot be empty.';
    if (!re.test(email))
        return 'Ooops! We need a valid email address.';
    return '';
};

export const passwordValidator = (password: string) => {
    if (!password || password.length <= 0)
        return 'Password cannot be empty.';
    return '';
};

export const nameValidator = (name: string) => {
    if (!name || name.length <= 0)
        return 'Name cannot be empty.';
    return '';
};

export const telephoneValidator = (phone: string) => {
    const re = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
    if (!phone || phone.length <= 0)
        return 'Phone number cannot be empty.';
    if (!re.test(phone))
        return 'Ooops! We need a valid phone number.';
    return '';
};

export const dateValidator = (date: string) => {
    const re = /^\d{4}\/\d{2}\/\d{2}$/;
    if (!date || date.length <= 0)
        return 'Date cannot be empty.';
    if (!re.test(date))
        return 'Ooops! We need a date in the format YYYY/MM/DD.';
    return '';
};

export const timeValidator = (time: string) => {
    const re = /^\d{2}:\d{2}$/;
    if (!time || time.length <= 0)
        return 'Time cannot be empty.';
    if (!re.test(time))
        return 'Ooops! We need a time in the format HH:MM.';
    return '';
};

export const postData = (url: string = '', data: object = {}) => {
    return fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then((response: Response) => response.json())
    .catch(error => {Alert.alert(JSON.stringify(error))});
};

export const storeData = async (key: string, value: string) =>
    await AsyncStorage.setItem('@LetsHangStore:'+key, value);

export const retrieveData = async (key: string) => {
    try {
        return await AsyncStorage.getItem('@LetsHangStore:'+key);
    } catch (error) {
        Alert.alert(error);
    }
};

export const removeData = async (...keys: Array<string>) =>
    await AsyncStorage.multiRemove(keys.map(key => '@LetsHangStore:'+key));

export const resetNavigatorStack = (navigation: Navigation, routeName: string) =>
    navigation.reset([NavigationActions.navigate({routeName})], 0);