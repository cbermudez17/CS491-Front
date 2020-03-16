import React, { memo, useState, ComponentProps } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Share } from 'react-native';
import { Card as PaperCard, Button, Modal, IconButton} from 'react-native-paper';

import { theme } from '../theme';

const obj = {
  action: "", 
  activityType: ""
};

type Props = {
  title: string,
  subtitle: string,
  uri: string,
  date: string,
  host: string,
  children: React.ReactNode;
};

/* util */ 

const shareMedia = async ({title}) => {
    try {
      const msg = 'Check out ' + title + ' on Let\'s Hang!'
      const result = await Share.share({
        message: msg
      });

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

const Card = ({title, subtitle, uri, date, host, children} : Props ) => {

  const [pressed, toggle] = useState(false);
  const [pressedButton, toggleShare] = useState(false);

  return ( // rerendering
  <View style={styles.container}>
    <TouchableOpacity onPress={() => toggle(!pressed)}>
      <PaperCard>
        <PaperCard.Cover source={{uri}}/>

        <PaperCard.Title title={title}/>
        
        <PaperCard.Content>
          <View style={styles.row}>
            <Text style={styles.subtitle}>{host}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <View style={styles.row}> 
            <Text style={styles.subtitle}>{date}</Text>
          </View>
          <View style={styles.row}>
            <IconButton icon="share" size={20} animated={true} onPress={() => shareMedia({title})}></IconButton>
            <IconButton icon="content-save" size={20} ></IconButton>
            <IconButton icon="calendar-question" size={20}></IconButton>
          </View>
        </PaperCard.Content>
      </PaperCard>
    </TouchableOpacity>

    <Modal visible={pressed}>
      <View style={styles.modal}>
        <View style={styles.description}>
          {children}
        </View>
        <View> 
          <Button onPress={() => toggle(!pressed)}>Go back</Button>
        </View>
      </View>
    </Modal>

    {/* <Modal visible={pressedButton}>
      <View style={styles.modal}>
        <View style={styles.row}>
          <IconButton icon="message-outline" size={44} style={{flex:1}} onPress={() => shareMedia()}/>
        </View>
        <View style={styles.row}>
          <IconButton icon="facebook" size={44} style={{flex:1}}onPress={() => shareMedia()}/>
        </View>
        <View style={styles.row}>
          <IconButton icon="twitter" size={44} style={{flex:1}}/>

        </View>
        <View style={styles.row}>
          <IconButton icon="email" size={44} style={{flex:1}}/>
        </View>
        <View>
          <Button onPress={() => toggleShare(!pressedButton)}>Go back</Button>
        </View>
      </View>
    </Modal> */}

  </View>
);};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderColor: theme.colors.secondary,
    borderRadius: 7,
    borderWidth: 1,
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  modal: {

    width: '100%',
    height: '100%',
    borderRadius: 5,
    backgroundColor: theme.colors.surface,
  },
  description: {
    height: '85%', 
    margin: 5,
    borderRadius: 10,
    padding: 5
  },
  subtitle: {
    color: "grey",
  },
  row: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },

});

export default memo(Card);