import React, { memo, useState } from 'react';
import {
    StyleSheet,
    ScrollView as View,
    StyleProp,
    ViewStyle,
    RefreshControl,
} from 'react-native';

type Props = {
    children: React.ReactNode,
    style?: StyleProp<ViewStyle>,
    onRefresh?: () => Promise<any>,
};

const ScrollView = ({ children, style, onRefresh }: Props) => {
    const [refreshing, setRefreshing] = useState(false);

    const _onRefresh = () => {
        setRefreshing(true);
        onRefresh().then(() => setRefreshing(false));
    };

    if (onRefresh) {
        return (
            <View refreshControl={<RefreshControl refreshing={refreshing} onRefresh={_onRefresh}></RefreshControl>} contentInsetAdjustmentBehavior="automatic" style={[styles.scroll, style]} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {children}
            </View>
        );
    } else {
        return (
            <View contentInsetAdjustmentBehavior="automatic" style={[styles.scroll, style]} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {children}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingBottom: 30,
    },
    scroll: {
        width: '100%',
    },
});

export default memo(ScrollView);