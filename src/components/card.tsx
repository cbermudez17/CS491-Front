import React, { memo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Share, Platform} from 'react-native';
import { Card as PaperCard, IconButton, Surface } from 'react-native-paper';
import { theme } from '../theme';
import { Event, Navigation } from '../types';
import { localizeDate, formatDate } from '../util';
import * as Calendar from 'expo-calendar';

type Props = {
  navigation: Navigation,
  event: Event,
};

const Card = ({ navigation, event }: Props) => {

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

  const saveToCalendar = async (date: string) => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      const calendars = await Calendar.getCalendarsAsync();
      if (Platform.OS == 'ios') {
        const calendar = await Calendar.getDefaultCalendarAsync();
        const eventDates = formatDate(date);
        const details = { title: event.name, startDate: eventDates.start, endDate: eventDates.end, location: event.location.name, notes: event.description};
        const eventId = await Calendar.createEventAsync(calendar.id, details);
        alert("Event added to phone calendar!");
      }
      else {
        alert("Android option is still being developed!");
      }
    }
  };

return (
    <Surface style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('DetailsScreen', { event: JSON.stringify(event) })}>
        <PaperCard>
          <PaperCard.Cover source={{ uri: 'https://picsum.photos/700' }} />
          <PaperCard.Title title={event.name} />
          <PaperCard.Content>
            <View>
              <Text style={styles.subtitle}>{event.location.name}</Text>
            </View>
            <View>
              <Text style={styles.subtitle}>{localizeDate(event.date, event.time)}</Text>
            </View>
            <View>
              <Text style={styles.subtitle}>{event.username}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <IconButton icon="share" size={20} color={theme.colors.secondary} animated={true} onPress={() => shareMedia(event.name)} />
              <IconButton icon="calendar-export" size={20} color={theme.colors.secondary} animated={true} onPress={() => saveToCalendar(localizeDate(event.date, event.time))}/>
              <IconButton icon="content-save" size={20} color={theme.colors.secondary} />
            </View>
          </PaperCard.Content>
        </PaperCard>
      </TouchableOpacity>
    </Surface>
  );
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
  subtitle: {
    color: "grey",
  },
});

export default memo(Card);