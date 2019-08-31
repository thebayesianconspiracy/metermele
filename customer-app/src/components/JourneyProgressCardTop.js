import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Animated, Button, Dimensions } from 'react-native';
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';
// import { JOURNEYS } from '../static/journeys';
// import console = require('console');
import { Icon } from 'react-native-elements'
// import console = require('console');
import { connect } from 'react-redux';

const styles = {
  container: {
    // flex: 1,
    backgroundColor: 'transparent',
    top: 5,
    position: 'absolute',
    flexGrow: 0
  },
  slides: {
    // flex: 1,
    backgroundColor: 'transparent',
  },
  slide: {
    backgroundColor: '#333',
    // height: 250,
    borderRadius: 10,
    padding: 0,
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
    alignItems: 'center'
  },
  modeImgs: {
    width: 20,
    height: 20
  },
  modeImgsView: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 25
  },
  outerCircle: {
    padding: 5,
    // margin: 5,
    borderRadius: 35
  },
  title: {
    padding: 10,
    color: '#000',
    fontWeight: '800'
  },
  subtitle: {
    color: '#fff',
  },
  chip: {
    flex: 0,
    backgroundColor: '#000',
    borderRadius: 30,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10
  }

}
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class JourneyProgressCardTopComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      journey: [this.props.journey.get('journeys').toJS()[this.props.appState.get('currentJourney')]],

    }

    this._renderItem = this._renderItem.bind(this);

  }
  _renderItem(self) {
    return ({ item, index }) => {
      const totalDistance = _.reduce(_.map(item.journey, ({ entity }) => entity.distance), (sum, n) => sum + n, 0);
      const totalFare = _.reduce(_.map(item.journey, ({ entity }) => entity.fare), (sum, n) => sum + n, 0);
      const totalTime = _.reduce(_.map(item.journey, ({ entity }) => entity.time), (sum, n) => sum + n, 0);
      // console.log(item.title, );

      const modes = _.map(item.journey, ({ entity }, id) => {
        var img = '';
        var ringColor = '';
        if ((entity.type == 'HOME') || (entity.type == 'DESTINATION') || (entity.type == 'STOP')) {
          return;
        }

        if (id < this.props.appState.get('currentLeg')) {
          ringColor = '#000';
          backgroundColor = '#000';
        } else if (id === this.props.appState.get('currentLeg')) {
          ringColor = '#27ae60';
          backgroundColor = '#eee';
        } else {
          ringColor = '#333';
          backgroundColor = '#eee';
        }
        // console.log(id, this.state.journey[0].journeyLegCurrentId, ringColor);

        if (entity.type === 'PERSON') {
          img = <View style={[styles.modeImgsView, { backgroundColor: backgroundColor }]}><Image source={require('../assets/PERSON.png')} style={[styles.modeImgs]} /></View>;
        } else if (entity.type === 'BUS') {
          img = <View style={[styles.modeImgsView, { backgroundColor: backgroundColor }]}><Image source={require('../assets/BUS.png')} style={[styles.modeImgs]} /></View>;
        } else if (entity.type === 'AUTO') {
          img = <View style={[styles.modeImgsView, { backgroundColor: backgroundColor }]}><Image source={require('../assets/AUTO.png')} style={[styles.modeImgs]} /></View>;
        }




        // console.log(entity.type, img);
        return (
          <View key={id} style={styles.colDiv}>
            {/* <View style={[styles.outerCircle, { backgroundColor: ringColor }]}> */}
            <View style={[styles.outerCircle, { backgroundColor: ringColor, position: 'relative' }]}>
              {img}
            </View>
          </View>)
      });

      return (
        <View style={styles.slide}>
          <View style={[styles.rowDiv, { padding: 7 }]}>
            {modes}
          </View>
        </View>
      );
    }

  }

  render() {
    return (
      <Carousel
        containerCustomStyle={styles.container}
        contentContainerCustomStyle={styles.slides}
        ref={(c) => { this._carousel = c; }}
        data={this.state.journey}
        renderItem={this._renderItem(this)}
        sliderWidth={viewportWidth}
        //   sliderHeight={400}

        itemWidth={viewportWidth - 25}
      //   itemHeight={200}
      />
    );
  }
}

export const JourneyProgressCardTop = connect(({ journey, appState }) => ({ journey, appState }))(JourneyProgressCardTopComponent);
