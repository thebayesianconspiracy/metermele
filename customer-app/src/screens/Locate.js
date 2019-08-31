import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { TouchableNativeFeedback, TextInput, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { loadPlaces } from '../actions/locations';
import LocateItem from '../components/LocateItem';

class Locate extends React.Component {
  static navigationOptions = {
    title: 'Select Location'
  };
  
  render() {
    const reason = this.props.navigation.state.params.reason;
    const predictions = this.props.locations.get('predictions');
    console.log("seleccted is", this.props.locations.get('selected').toJS());
    const onChangeText = _.debounce(input => this.props.dispatch(loadPlaces({ input })), 100);
    return (
      <View style={styles.container}>
        <TextInput
            onChangeText={onChangeText}
            style={[styles.whereToBox, styles.itemPadding]}
            placeholder="Where to?"
            underlineColorAndroid="transparent"
        />
        <FlatList
            data={predictions && predictions.toJS()}
            renderItem={({item}) => <LocateItem item={item} reason={reason}/>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  whereToBox: {
    height: 60,
    fontSize: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    elevation: 1,
    shadowOpacity: 0.8,
    shadowRadius: 4
  },
  itemPadding: {
    padding: 15,
    paddingLeft: 20,
  },
  container: {
  }
});

export default connect(({ locations }) => ({ locations }))(Locate);
