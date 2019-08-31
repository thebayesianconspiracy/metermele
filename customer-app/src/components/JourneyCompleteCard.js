import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';
// import { JOURNEYS } from '../static/journeys';
// import console = require('console');
import { Icon, Button } from 'react-native-elements'
// import console = require('console');
import {connect} from 'react-redux';
// import console = require('console');

const styles = {
  container: {
    // flex: 1,
    backgroundColor: 'transparent',
    bottom: 5,
    position: 'absolute',
    flexGrow: 0
  },
  slides: {
    // flex: 1,
    backgroundColor: 'transparent',
  },
  slide: {
    backgroundColor: '#fff',
    // height: 250,
    borderRadius: 10,
    // padding: 20,
    shadowColor: '#333',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5
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
    borderRadius: 25,
  },
  outerCircle: {
    padding: 5,
    // margin: 5,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#333'
  },
  title: {
    padding: 10,
    color: '#000',
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 20
  },
  subtitle: {
    color: '#333',
    position: 'absolute',
    bottom:-20,
    backgroundColor: '#fff',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5
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

class JourneyCompleteCardComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      journey: [this.props.journey.get('journeys').toJS()[this.props.appState.get('currentJourney')]],
    }

    // this._renderItem = this._renderItem.bind(this);

  }
  
  

  _renderItem(self) {
    return ({ item, index }) => {
      // const totalDistance = _.reduce(_.map(item.journey, ({ entity }) => entity.distance), (sum, n)=>sum + n, 0);
      // const totalFare = _.reduce(_.map(item.journey, ({ entity }) => entity.fare), (sum, n)=>sum + n, 0);
      // const totalTime = _.reduce(_.map(item.journey, ({ entity }) => entity.time), (sum, n)=>sum + n, 0);
      // // console.log(item.title, );

      const modes = _.map(item.journey, ({ entity }, id) => {
        var img = '';
        var ringColor = '';


        if (entity.type === 'PERSON') {
          img = <View style={styles.modeImgsView}><Image source={require('../assets/PERSON.png')} style={styles.modeImgs} /></View>;
        } else if (entity.type === 'BUS') {
          img = <View style={styles.modeImgsView}><Image source={require('../assets/BUS.png')} style={styles.modeImgs} /></View>;
        } else if (entity.type === 'AUTO') {
          img = <View style={styles.modeImgsView}><Image source={require('../assets/AUTO.png')} style={styles.modeImgs} /></View>;
        }

        if ((entity.occupancy === 'NONE') || (entity.occupancy === 'HIGH')) {
          ringColor = '#27ae60';
        } else if (entity.occupancy === 'MID') {
          ringColor = '#f1c40f';
        } else if (entity.occupancy === 'LOW') {
          ringColor = '#c0392b';
        }




        // console.log(entity.type, img);
        return (
          <View key={id} style={styles.colDiv}>
            {/* <View style={[styles.outerCircle, { backgroundColor: ringColor }]}> */}
            <View style={[styles.outerCircle, { backgroundColor: '#eee', position: 'relative' }]}>
              {img}
              {/* <View style={{position:'absolute', height: 17, width: 17, backgroundColor: ringColor,right: 0, borderRadius: 10}}></View> */}
              {/* <Text style={{position:'absolute', height: 20, width: 70, backgroundColor:'#333',bottom:-5,left:0, borderRadius: 5, textAlign: 'center', color: '#fff'}}>₹{entity.fare}</Text> */}
            </View>
            {/* <Text style={{fontWeight: '800', paddingTop: 5, fontSize: 12}}>{entity.time} mins</Text> */}
          </View>)
      });

      var stars = [];

      for (let j = 0; j < 5; j++) {
        if(j+1<=this.state.rating) stars.push(<Icon name='star' key={j+1} type='material-community' size={40} color='#f39c12' onPress={()=>{
          this.setState({rating:j+1});
          // console.log('YoyoPressed',j, this.state);
        }} />);
        else stars.push(<Icon name='star' key={j+1} type='material-community' size={40} color='#ddd'  onPress={()=>{
          this.setState({rating:j+1});
          // console.log('YoyoPressed',j, this.state);
        }} />);
      }
      const totalFare = _.reduce(_.map(this.state.journey[0].journey, ({ entity }) => entity.fare), (sum, n)=>sum + parseFloat(n), 0).toFixed(2);
      const totalDistance = _.reduce(_.map(this.state.journey[0].journey, ({ entity }) => entity.distance), (sum, n)=>sum + parseFloat(n), 0).toFixed(2);
      const savedFare = (totalDistance*20)-totalFare;
      console.log('final', totalFare, totalDistance, savedFare);
      
      return (
        <View style={styles.slide}>
          <Text style={styles.title}>Journey Complete!</Text>
          <View style={[styles.rowDiv, { padding: 10, backgroundColor: '#333' }]}>
            {modes}
          </View>
          <View style={[styles.rowDiv, { justifyContent: 'space-evenly', padding: 10 }]}>
            <View style={styles.colDiv}>
            <Icon name='leaf' type='material-community' size={50} color='#fff' containerStyle={{ backgroundColor: '#333', padding: 10, borderRadius: 50 }} />
            <Text style={styles.subtitle}>2kg CO2 Saved</Text>
            </View>
            <View style={styles.colDiv}>
            <Icon name='cash' type='material-community' size={50} color='#fff' containerStyle={{ backgroundColor: '#333', padding: 10, borderRadius: 50 }} />
            <Text  style={styles.subtitle}>{savedFare}Rs. Saved</Text>
            </View>
            
          </View>
          <View style={[styles.rowDiv,{justifyContent:'space-evenly', padding: 20}]}>
            {stars}
          </View>

          <Button title="Submit" buttonStyle={{ backgroundColor: '#333', marginTop: 10 }} 
          onPress={()=>{
            this.props.dispatch({
              type: 'APPSTATE_UPDATE_ACTIVE_SCREEN',
              payload: {
                activeScreen: 'LOCATION_SELECT'
              }
            });
            this.props.dispatch({
              type: 'JOURNEY_INITIALIZE',
              payload: {
                journeys: []
              }
            });
          }}/>
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

export const JourneyCompleteCard = connect(({ journey, appState }) => ({ journey, appState }))(JourneyCompleteCardComponent);
