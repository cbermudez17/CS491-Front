import React, { memo } from 'react';
import {
    StyleSheet,
    ScrollView as View,
    StyleProp,
    ViewStyle,
} from 'react-native';

type Props = {
    children: React.ReactNode,
    style?: StyleProp<ViewStyle>,
};

const ScrollView = ({ children, style }: Props) => (
    <View contentInsetAdjustmentBehavior="automatic" style={[styles.scroll, style]} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {children}
    </View>
);

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