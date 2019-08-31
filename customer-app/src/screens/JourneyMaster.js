import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native';
import JourneyMap from '../components/JourneyMap';
import { JourneyCard } from '../components/JourneyCard';
import { JourneyProgressCardTop } from '../components/JourneyProgressCardTop';
import { JourneyProgressCardBottom } from '../components/JourneyProgressCardBottom';
import { JourneyCompleteCard } from '../components/JourneyCompleteCard';
import { SettingsView } from '../components/SettingsView';
import { JOURNEYS, CURRRENT_JOURNEY } from '../static/journeys';
import { Icon, Overlay, Button } from 'react-native-elements'
import Navigation from '../utils/Navigation';
// import console = require('console');
// import console = require('console');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    // height:700
  },
  filter: {
    position: 'absolute',
    top: 5,
    right: 5
  },
  userInputFrom: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    top: 50,
    padding: 10
  },
  userInputTo: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    top: 100,
    padding: 10
  },
  whereTo: {
    backgroundColor: 'white',
    width: '95%',
    padding: 10,
    paddingLeft: 20,
    borderWidth: 0,
    borderColor: 'black',
    borderRadius: 4
  },
});

class JourneyMaster extends React.Component {
  static navigationOptions = {
    header: null,
    headerMode: 'none',
  };

  constructor(props) {
    super(props);
    /* this.props.dispatch({
     *   type: JOURNEY_UPDATE_LEG,
     *   payload: {
     *     leg: 3
     *   }
     * })*/
    this.state = {
      isVisible: false,
    };    
  }

  render() {
    const currentJourney = this.props.appState.get('currentJourney');
    const currentJourneyBrowse = this.props.appState.get('currentJourneyBrowse');
    const currentLeg = this.props.appState.get('currentLeg');
    const activeScreen = this.props.appState.get('activeScreen');

    const journeys = this.props.journey.get('journeys').toJS();
    let componentToRender = '';
    var toShowOnMap = '';
    if (activeScreen == 'LOCATION_SELECT') {
      const where_from = this.props.locations.getIn(['selected', 'from', 'description']) || "Where from?";
      const where_to = this.props.locations.getIn(['selected', 'to', 'description']) || "Where to?";
      componentToRender = (<View style={styles.container}>
        <View style={styles.userInputFrom}>
          <TouchableNativeFeedback onPress={() => Navigation.navigate('Locate', {reason: 'from'})}>
            <View style={styles.whereTo}>
              <Text style={styles.navText}>{where_from}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>

        <View style={styles.userInputTo}>
          <TouchableNativeFeedback onPress={() => Navigation.navigate('Locate', { reason: 'to' })}>
            <View style={styles.whereTo}>
              <Text style={styles.navText}>{where_to}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        
        <View style={styles.filter}>

          <Button
              icon={
                <Icon
                name="cog"
                size={30}
                type='font-awesome'
                color="white"
                       />
                   }
              onPress={() => {
                  this.setState({ isVisible: true });
                }}
              title=""
              buttonStyle={{ borderRadius: 50, padding: 9, paddingRight: 10, paddingLeft: 10, backgroundColor: '#333' }}
          />
        </View>
        <Overlay
            isVisible={this.state.isVisible}
            onBackdropPress={() => this.setState({ isVisible: false })}
        >
          <SettingsView></SettingsView>
        </Overlay>
      </View>);
      toShowOnMap = [];
    } if (activeScreen == 'JOURNEY_CHOOSE') {
      componentToRender = (<View style={styles.container}>
        <JourneyCard></JourneyCard>
        <View style={styles.filter}>
          <Button
              icon={
                <Icon
                name="cog"
                size={30}
                type='font-awesome'
                color="white"
                       />
                   }
              onPress={() => {
                  this.setState({ isVisible: true });
                }}
              title=""
              buttonStyle={{ borderRadius: 50, padding: 9, paddingRight: 10, paddingLeft: 10, backgroundColor: '#333' }}
          />
        </View>
        <Overlay
            isVisible={this.state.isVisible}
            onBackdropPress={() => this.setState({ isVisible: false })}
        >
          <SettingsView></SettingsView>
        </Overlay>
      </View>);
      toShowOnMap = _.get(journeys, [currentJourneyBrowse, 'journey'], []);
    }
    else if (activeScreen == 'JOURNEY_PROGRESS') {
      componentToRender = (<View style={styles.container}>
        <JourneyProgressCardTop/>
        <JourneyProgressCardBottom />
      </View>);
      toShowOnMap = [journeys[currentJourney].journey[currentLeg]];
      // toShowOnMap = journeys[currentJourneyBrowse].journey;
      // console.log('PROGRESS',[{journey:[journeys[currentJourney].journey[currentLeg]]}]);
    }
    else if (activeScreen == 'JOURNEY_END') {
      componentToRender = (<View style={styles.container}>
        <JourneyCompleteCard />
      </View>);
      toShowOnMap = journeys[currentJourney].journey;
    }
    return (
      <View style={styles.container}>
        <JourneyMap journey={toShowOnMap} />
        {componentToRender}
      </View>
    )
  }
}

export default connect(({ journey, appState, locations }) => ({ journey, appState, locations }))(JourneyMaster);
