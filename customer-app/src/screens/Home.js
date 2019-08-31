import React from 'react';
import Config from 'react-native-config'
import { StyleSheet, Text, View, Button } from 'react-native';
import Navigation from '../utils/Navigation';

class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Home Screen. Env key: {Config.RANDOM_KEY}</Text>
        <Button
          title="Go to About"
          onPress={() => Navigation.navigate('About')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Home;
