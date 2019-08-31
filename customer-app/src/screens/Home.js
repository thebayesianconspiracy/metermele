import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Navigation from '../utils/Navigation';

class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Home Screen</Text>
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
