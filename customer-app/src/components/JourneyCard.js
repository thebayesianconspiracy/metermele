import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import _ from 'lodash';
import {connect} from 'react-redux';

import Carousel from 'react-native-snap-carousel';
// import { JOURNEYS } from '../static/journeys';
// import console = require('console');
import { Icon, Button, Overlay } from 'react-native-elements'
// import console = require('console');

const styles = {
  container: {
    // flex: 1,
    backgroundColor: 'transparent',
    bottom: 30,
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
    width: 30,
    height: 30
  },
  modeImgsView: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 25
  },
  outerCircle: {
    padding: 10,
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
  chip:{
    flex:0, 
    backgroundColor:'#000', 
    borderRadius:30, 
    padding:5, 
    paddingLeft:10, 
    paddingRight:10
  }

}
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const distanceTemplates = [
  23,
  30
];

const fareTemplates = [
  35,
  40
];

const timeTemplates = [
  23,
  34
];

class JourneyCardComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    }
  }

  _renderItem(self) {
    return ({ item, index }) => {
      const totalDistance = _.reduce(_.map(item.journey, ({ entity }) => entity.distance), (sum, n)=>sum + parseFloat(n), 0).toFixed(2);
      const totalFare = _.reduce(_.map(item.journey, ({ entity }) => entity.fare), (sum, n)=>sum + parseFloat(n),0).toFixed(0);
      const totalTime = _.reduce(_.map(item.journey, ({ entity }) => entity.time), (sum, n)=>sum + parseFloat(n), 0).toFixed(0);

      const modes = _.map(item.journey, ({ entity }, id) => {
        var img = '';
        var ringColor = '';

        if ((entity.type=='HOME')|| (entity.type=='DESTINATION')|| (entity.type=='STOP')){
          return;
        }

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

        return (
          <View key={id} style={styles.colDiv}>
            {/* <View style={[styles.outerCircle, { backgroundColor: ringColor }]}> */}
            <View style={[styles.outerCircle, { backgroundColor: '#eee', position:'relative' }]}>
              {img}
              <View style={{position:'absolute', height: 17, width: 17, backgroundColor: ringColor,right: 0, borderRadius: 10}}></View>
              <Text style={{position:'absolute', height: 20, width: 70, backgroundColor:'#333',bottom:-5,left:0, borderRadius: 5, textAlign: 'center', color: '#fff'}}>₹{entity.fare.toFixed(0)}</Text>
            </View>
            <Text style={{fontWeight: '800', paddingTop: 5, fontSize: 12}}>{entity.time.toFixed(0)} mins</Text>
          </View>)
      });

      return (
        <TouchableOpacity style={styles.slide} onPress={() => {
          // console.log(this._carousel.currentIndex);
          const currentJourney = this._carousel.currentIndex;
          const maxlegs = this.props.journey.get('journeys').toJS()[currentJourney].journey.length - 1;
          this.props.dispatch({
            type: 'APPSTATE_UPDATE_MAX_LEGS',
            payload: {
              maxLegs: maxlegs
            }
          });
          this.props.dispatch({
            type: 'APPSTATE_UPDATE_CURRENT_JOURNEY',
            payload: {
              currentJourney: currentJourney
            }
          });
          this.props.dispatch({
            type: 'APPSTATE_UPDATE_ACTIVE_SCREEN',
            payload: {
              activeScreen: 'JOURNEY_PROGRESS'
            }
          });
        }}>
          <View style={[styles.rowDiv,{paddingRight: 10}]}>
            <Text style={styles.title}>Journey {index + 1} : {item.title}</Text>
            <Icon name='information' type='material-community' color='#333' onPress={()=>{
                // console.log('i clicked');
                self.setState({isVisible: true})
              }}/>
            <Overlay
                isVisible={self.state.isVisible}
                onBackdropPress={() => self.setState({ isVisible: false })}
                overlayStyle={{justifyContent:'center', alignItems:'center'}}
            >
              <Image source={require('../assets/yo.jpg')} style={{height:400, width:250}} />
            </Overlay>
          </View>
          <View style={[styles.rowDiv, { backgroundColor: '#555', padding: 5 }]}>
            <View style={[styles.rowDiv, styles.chip]}>
              <Icon name='clock-outline' type='material-community' color='#fff' />
              <Text style={styles.subtitle}> {totalTime} Mins</Text>
            </View>
            <View style={[styles.rowDiv,styles.chip]}>
              <Icon name='map-marker-path' type='material-community' color='#fff' />
              <Text style={styles.subtitle}> {totalDistance} KMs</Text>
            </View>
            <View style={[styles.rowDiv,styles.chip]}>
              <Icon name='currency-inr' type='material-community' color='#fff' />
              <Text style={styles.subtitle}>{totalFare} Rs</Text>
            </View>
            
          </View>
          <View style={[styles.rowDiv, { padding: 10 }]}>
            {modes}
          </View>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <Carousel
        containerCustomStyle={styles.container}
        contentContainerCustomStyle={styles.slides}
        ref={(c) => { this._carousel = c; }}
        data={this.props.journey.get('journeys').toJS()}
        renderItem={this._renderItem(this)}
        sliderWidth={viewportWidth}
        onSnapToItem={(i)=>{
            console.log('snapped_to_',i);
          this.props.dispatch({
            type: 'APPSTATE_UPDATE_BROWSE',
            payload: {
              currentJourneyBrowse: i
            }
          });
        }}
        itemWidth={viewportWidth - 100}
      />
    );
  }
}

export const JourneyCard = connect(({ journey, appState }) => ({ journey, appState }))(JourneyCardComponent);



// export default connect(({journey}) => ({journey}))(JourneyCard);
