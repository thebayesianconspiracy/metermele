import React from 'react';
import { StyleSheet, View } from 'react-native';
import AnimatedMarker from './AnimatedMarker';
import _ from 'lodash'
import { Image } from 'react-native';


const markerSize = 13;

const styles = StyleSheet.create({
  myLocation: {
    width: markerSize,
    height: markerSize,
    backgroundColor: '#66ccff',
    borderRadius: markerSize,
    borderWidth: 1,
    borderColor: 'black',
  }
});

const MARKER_TYPES = {
  PERSON: () => <Image source={require('../assets/PERSON_MARKER.png')} style={{ width: 30, height: 30 }}/>,
  HOME: () => <Image source={require('../assets/home.png')} style={{ width: 40, height: 40 }}/>,
  STOP: () => <Image source={require('../assets/marker.png')} style={{ width: 20, height: 20 }}/>,
  DESTINATION: () => <Image source={require('../assets/flag.png')} style={{ width: 40, height: 40 }}/>,
  BUS: () => <Image source={require('../assets/BUS_MARKER.png')} style={{ width: 30, height: 30 }}/>,
  USER: () => <View style={styles.myLocation}></View>,
  AUTO: () => <Image source={require('../assets/AUTO_MARKER.png')} style={{ width: 30, height: 30 }}/>
}

const CustomMarker = ({ coordinate, type }) => {
  if (!_.has(MARKER_TYPES, type)) {
    return null;
  }
  const TypedMarker = MARKER_TYPES[type];
  return (
    <AnimatedMarker coordinate={coordinate}>
      <TypedMarker />
    </AnimatedMarker>
  )
}

export default CustomMarker;
