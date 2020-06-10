import { Alert, AsyncStorage } from "react-native";
import { Navigation } from "./types";
import { NavigationActions } from "react-navigation";
import Config from "./config.json";

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

export const postData = (url: string, data: object = {}) => {
    if (!url.startsWith('http')) {
        url = Config.server[Config.stage] + url;
    }
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

export const formatDate = (date: string) => {
    let parsedDate = date.split(" ")[0].split("/"), time = date.split(" ")[1], month = parsedDate[0], day = parseInt(parsedDate[1]), year = parsedDate[2], meridianIndex = time.search(/[aApP]/), meridian = time.substr(meridianIndex), hour = parseInt(time.split(":")[0]), minutes = time.split(":")[1].substr(0, meridianIndex - 2);

    if (meridian === "PM") {
      let adjustedTime = hour + 12;
      if (adjustedTime === 24) {
        adjustedTime = 0;
      }
      hour = adjustedTime;
    }
    else if (hour === 12) {
      hour = 0;
    }

    let startDate = new Date();
    startDate.setFullYear(parseInt(year));
    startDate.setMonth(parseInt(month) - 1);
    startDate.setDate(day);
    startDate.setHours(hour);
    startDate.setMinutes(parseInt(minutes));
    startDate.setSeconds(0,0)
    
    // making ending time 2 hours later for now
    hour += 2;
    if (hour >= 24) {
      hour =- 24;
      day += 1;
    }

    let endDate = new Date();
    endDate.setFullYear(parseInt(year));
    endDate.setMonth(parseInt(month) - 1);
    endDate.setDate(day);
    endDate.setHours(hour);
    endDate.setMinutes(parseInt(minutes));
    endDate.setSeconds(0, 0);

    return { start: startDate, end: endDate };
};