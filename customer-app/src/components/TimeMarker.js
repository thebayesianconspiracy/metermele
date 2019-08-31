import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import _ from 'lodash'
import moment from 'moment'

import AnimatedMarker from './AnimatedMarker';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 5,
  },
  time: {
    color: 'white'
  }
});

const TimeMarker = ({ coordinate, time }) => (
  <AnimatedMarker coordinate={coordinate}>
    <View style={styles.container}>
      <Text style={styles.time}>{moment(time).format("hh:mm A")}</Text>
    </View>
  </AnimatedMarker>
)

export default TimeMarker;
