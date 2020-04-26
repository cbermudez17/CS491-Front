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

export const usernameValidator = (username: string) => {
    const re = /^[A-Za-z0-9.\-_$!]{4,10}$/;
    if (!username || username.length <= 0)
        return 'Username cannot be empty.';
    if (!re.test(username))
        return 'Username must be 4-10 characters long and only use letters, numbers, and any of the following {.-_$!}.';
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

export const emptyValidator = (value: string, valueName: string) => {
    if (!value || value.length <= 0)
        return valueName + ' cannot be empty.';
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

export const resetNavigatorStack = (navigation: Navigation, routeName: string, params?: object) =>
    navigation.reset([NavigationActions.navigate({routeName, params})], 0);

export const localizeDate = (date: string, time: string) => {
    let year$ = date.substr(0, 4), month$ = date.substr(5, 2), day$ = date.substr(8),
    hour$ = time.substr(0, 2), minutes$ = time.substr(3), meridian = 'AM';
    
    let d = new Date();
    d.setUTCFullYear(parseInt(year$));
    d.setUTCMonth(parseInt(month$) - 1);
    d.setUTCDate(parseInt(day$));
    d.setUTCHours(parseInt(hour$));
    d.setUTCMinutes(parseInt(minutes$));

    let year = d.getFullYear(),
    month = d.getMonth() + 1,
    day = d.getDate(),
    hour = d.getHours(),
    minutes = d.getMinutes();

    minutes$ = minutes < 10 ? '0' + minutes : minutes.toString();

    if (hour == 0) {
        hour = 12;
    } else if (hour >= 12) {
        meridian = 'PM';
        if (hour > 12) {
            hour -= 12;
        }
    }
    return `${month}/${day}/${year} ${hour}:${minutes$}${meridian}`;
};