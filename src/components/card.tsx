import React, { memo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Share } from 'react-native';
import { Card as PaperCard, Button, Modal, IconButton, Surface } from 'react-native-paper';
import { theme } from '../theme';
import { Location } from '../types';

type Props = {
  title: string,
  location: Location,
  uri?: string,
  date: string,
  host: string,
  children: React.ReactNode;
};

const shareMedia = async (title: string) => {
  try {
    const message = 'Check out ' + title + ' on Let\'s Hang!'
    const result = await Share.share({ message });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        alert("Sent");
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
};

const Card = ({ title, location, uri = 'https://picsum.photos/700', date, host, children }: Props) => {
  const [pressed, toggle] = useState(false);

  return (
    <Surface style={styles.container}>
      <TouchableOpacity onPress={() => toggle(!pressed)}>
        <PaperCard>
          <PaperCard.Cover source={{ uri }} />
          <PaperCard.Title title={title} />
          <PaperCard.Content>
            <View>
              <Text style={styles.subtitle}>{location.name}</Text>
            </View>
            <View>
              <Text style={styles.subtitle}>{date}</Text>
            </View>
            <View>
              <Text style={styles.subtitle}>{host}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <IconButton icon="share" size={20} color={theme.colors.secondary} animated={true} onPress={() => shareMedia(title)} />
              <IconButton icon="content-save" size={20} color={theme.colors.secondary} />
              <IconButton icon="calendar-question" size={20} color={theme.colors.secondary} />
            </View>
          </PaperCard.Content>
        </PaperCard>
      </TouchableOpacity>

      <Modal visible={pressed} contentContainerStyle={styles.modal}>
        <View style={styles.description}>
          {children}
        </View>
        <View>
          <Button onPress={() => toggle(!pressed)}>Go back</Button>
        </View>
      </Modal>
    </Surface>);
};

const styles = StyleSheet.create({
  container: {
    width: '99.5%',
    borderColor: theme.colors.secondary,
    borderWidth: 0.1,
    borderRadius: 7,
    marginVertical: 15,
    elevation: 4,
  },
  modal: {
    width: '100%',
    height: '100%',
    borderRadius: 7,
    backgroundColor: theme.colors.surface,
  },
  description: {
    padding: 20,
  },
  subtitle: {
    color: "grey",
  },
});

export default memo(Card);