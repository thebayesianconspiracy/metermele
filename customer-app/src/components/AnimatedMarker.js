import React from 'react';
import { Marker } from 'react-native-maps';
import _ from 'lodash';

// #TODO Animate marker coordinate movement

class AnimatedMarker extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Marker.Animated
          {...this.props}/>
    );
  }
}

export default AnimatedMarker;
