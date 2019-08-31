import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Switch, Button, Dimensions } from 'react-native';
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';
// import { JOURNEYS } from '../static/journeys';
// import console = require('console');
import { Icon, CheckBox, Slider, Input } from 'react-native-elements'
import {connect} from 'react-redux';

const styles = {
  container: {
    // flex: 1,
    backgroundColor: 'transparent',
    bottom: 30,
    position: 'absolute',
    flexGrow: 0
  },
  rowDiv: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  colDiv: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  box: {
    flex: 0,
    justifyContent: 'center',
    width: '100%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#eee',
    marginTop: 10
  },
  checkbox: {
    padding: 0,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    margin: 0
  },
  heading: {
    fontWeight: '800'
  }
}
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class SettingsViewComponent extends React.Component {
  
  render() {
    return (
      <View style={[styles.colDiv, { justifyContent: 'space-between', alignItems: 'stretch' }]}>
        <View style={[styles.colDiv]}>
          <Text style={[styles.heading, { fontSize: 24, padding: 20 }]}>Settings</Text>
          <View style={[styles.box]}>
            <Text style={styles.heading}>Bus Preference</Text>
            <View style={[styles.rowDiv, { flex: 0, marginTop: 10 }]}>
              <CheckBox
                checkedColor={'#333'}
                title='AC'
                size={18}
                containerStyle={styles.checkbox}
                textStyle={{ fontWeight: '100' }}
                checked={this.props.appState.get('busPref').get('AC')}
                onPress={() => this.props.dispatch({type: 'APPSTATE_UPDATE_BUS_PREF_AC',payload: {acPref: !this.props.appState.get('busPref').get('AC')}})} />

              <CheckBox
                checkedColor={'#333'}
                title='Express' size={18}
                containerStyle={styles.checkbox}
                textStyle={{ fontWeight: '100' }}
                checked={this.props.appState.get('busPref').get('EXPRESS')}
                onPress={() => this.props.dispatch({type: 'APPSTATE_UPDATE_BUS_PREF_EXPRESS',payload: {expressPref: !this.props.appState.get('busPref').get('EXPRESS')}})} />

              <CheckBox
                checkedColor={'#333'}
                title='Local'
                size={18}
                containerStyle={styles.checkbox}
                textStyle={{ fontWeight: '100' }}
                checked={this.props.appState.get('busPref').get('LOCAL')}
                onPress={() => this.props.dispatch({type: 'APPSTATE_UPDATE_BUS_PREF_LOCAL',payload: {localPref: !this.props.appState.get('busPref').get('LOCAL')}})} />

            </View>
          </View>

          <View style={[styles.box, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={[styles.heading, { marginRight: 10 }]}>Auto book Auto-Rickshaw</Text>
            <Switch
              value={this.props.appState.get('autoBookAuto')}
              trackColor={{ true: "#333", false: '#aaa' }}
              thumbColor={'#333'}
              onValueChange={(autoBookAuto) => this.props.dispatch({type: 'APPSTATE_UPDATE_AUTO_BOOK',payload: {autoBookAuto}})} />
          </View>

          <View style={[styles.box]}>
            <View style={[styles.rowDiv, { marginTop: 10, marginBottom: 10 }]}>
              <Text style={styles.heading}>Maximum Walking Distance</Text>
              <Text>{this.props.appState.get('maxWalkingValue').toFixed(1)} KMs</Text>
            </View>
            <Slider
              value={this.props.appState.get('maxWalkingValue')}
              maximumValue={3}
              minimumValue={0}
              minimumTrackTintColor={'#333'}
              maximumTrackTintColor={'#aaa'}
              thumbTintColor={'#333'}
              onValueChange={maxWalkingValue => this.props.dispatch({type: 'APPSTATE_UPDATE_MAX_WALKING',payload: {maxWalkingValue}})}
            />
          </View>

          <View style={[styles.box, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={[styles.heading, { marginRight: 10 }]}>Meter Mèlè Amount</Text>
            <View style={{ width: 100, textAlign: 'center' }}>
              <Input
                style={{ alignSelf: 'center', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}
                maxLength={3}
                onChangeText={(meterMeleAmount) => this.props.dispatch({type: 'APPSTATE_UPDATE_METER_MELE',payload: {meterMeleAmount}})}
                value={this.props.appState.get('meterMeleAmount')}
              />
            </View>
          </View>
        </View>
        {/* <View>
          <Button
            title="Apply Changes"
            color="#333"
          />
        </View> */}
      </View>
    );
  }
}

export const SettingsView = connect(({appState }) => ({appState }))(SettingsViewComponent);
