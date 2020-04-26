import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import ScrollView from './scroll-view';

type Props = {
    tabLabel?: string,
    children: React.ReactNode,
    onRefresh?: () => Promise<any>,
};

const CardDeck = ({ children, onRefresh }: Props) => (
    <ScrollView onRefresh={onRefresh ? onRefresh : undefined} style={styles.deck}>{children}</ScrollView>
);

const styles = StyleSheet.create({
    deck: {
        padding: 5,
    }
});

export default memo(CardDeck);