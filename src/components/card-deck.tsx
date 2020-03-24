import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
    tabLabel?: string,
    children: React.ReactNode;
};

const CardDeck = ({ children }: Props) => (
    <View style={styles.deck}>{children}</View>
);

const styles = StyleSheet.create({
    deck: {
        padding: 5,
    }
});

export default memo(CardDeck);