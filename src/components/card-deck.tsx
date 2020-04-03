import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import ScrollView from './scroll-view';

type Props = {
    tabLabel?: string,
    children: React.ReactNode;
};

const CardDeck = ({ children }: Props) => (
    <ScrollView style={styles.deck}>{children}</ScrollView>
);

const styles = StyleSheet.create({
    deck: {
        padding: 5,
    }
});

export default memo(CardDeck);