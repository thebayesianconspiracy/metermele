import React from 'react';
import { Animated } from 'react-native-maps';
import _ from 'lodash';

// #TODO Animate map region movement

class AnimatedMap extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Animated
          {...this.props}/>
    );
  }
}

export default AnimatedMap;
