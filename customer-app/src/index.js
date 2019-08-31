import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './screens/Home';
import Map from './screens/Map';
import About from './screens/About';
import JourneyChooser from './screens/JourneyChooser';
import JourneyProgress from './screens/JourneyProgress';
import JourneyMaster from './screens/JourneyMaster';
import BookingComplete from './screens/BookingComplete';
import Locate from './screens/Locate';

const RootStack = createStackNavigator(
  {
    Map,
    Home,
    About,
    JourneyChooser,
    JourneyProgress,
    BookingComplete,
    JourneyMaster,
    Locate
  },
  {
    initialRouteName: 'JourneyMaster'
  }
);

const App = createAppContainer(RootStack);

export default App;
