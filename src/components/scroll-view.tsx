import React, { memo } from 'react';
import {
    StyleSheet,
    ScrollView as View,
} from 'react-native';

type Props = {
    children: React.ReactNode;
};

const ScrollView = ({ children }: Props) => (
    <View contentInsetAdjustmentBehavior="automatic" style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
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