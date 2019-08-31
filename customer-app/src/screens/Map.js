import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import JourneyMap from '../components/JourneyMap';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class MapScreen extends React.Component {
  static navigationOptions = {
    header: null,
    headerMode: 'none',
  };

  state = {
    journey: [
      {
        entity: {
          coordinate: {
            latitude: 12.931093,
            longitude: 77.628987,
          },
          type: "PERSON",
        },
        route: [{
          latitude: 12.931093,
          longitude: 77.628987,
        }, {
          latitude: 12.991093,
          longitude: 77.828987,
        }],
        time: {
          coordinate: {
            latitude: 12.991093,
            longitude: 77.828987,
          },
          time: new Date()
        }
      }
    ]
  }
  
  render() {
    return (
      <View style={styles.container}>
        <JourneyMap journey={this.state.journey} />
      </View>
    )
  }
}

export default MapScreen;
