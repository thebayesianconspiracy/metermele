import React from 'react';
import { TouchableOpacity, TextInput, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Navigation from '../utils/Navigation';
import { selectPlace } from '../actions/locations';

const ListItem = ({ item, dispatch, reason, locations }) => {
  const onSelect = _.flow([
    () => dispatch(selectPlace(item, reason )),
    () => {
      Navigation.back()
      let transition = false;
      if (reason == 'from' && !_.isEmpty(locations.getIn(['selected', 'to']))) {
        transition = true;
      }
      if (reason == 'to' && !_.isEmpty(locations.getIn(['selected', 'from']))) {
        transition = true;
      }
      if (transition) {
        dispatch({
          type: "APPSTATE_UPDATE_ACTIVE_SCREEN",
          payload: {
            activeScreen: "JOURNEY_CHOOSE"
          }
        })
      }
    }
  ]);
  return (
    <View style={[styles.itemPadding, styles.ListValue]}>
      <TouchableOpacity onPress={onSelect}>
        <Text style={{fontSize: 16}}>
          {item.description}
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  ListValue: {
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'white',
  },
  itemPadding: {
    padding: 15,
    paddingLeft: 20,
  }
});


export default connect(({ locations }) => ({ locations }))(ListItem);
