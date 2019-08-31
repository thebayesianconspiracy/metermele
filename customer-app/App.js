import React from 'react';
import { Provider } from 'react-redux';

import App from './src';
import Navigation from './src/utils/Navigation';
import Store from './src/utils/Store';
import Poll from './src/utils/Poll';

export default class extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <App
            ref={(ref) => {
                Navigation.setTopLevelNavigator(ref);
              }}
        />
      </Provider>
    );
  }
}
