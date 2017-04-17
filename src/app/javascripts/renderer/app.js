import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import settings from './reducers/settings';
import pullRequests from './reducers/pull-requests';
import releases from './reducers/releases';
import errors from './reducers/errors';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import PrList from './components/pr-list';
import Toolbar from './components/toolbar';

const reducer = combineReducers({
  pullRequests,
  releases,
  settings,
  errors,
});

const store = compose(
  applyMiddleware(thunk, logger())
)(createStore)(reducer);


const Main = () => (
  <Provider store={store}>
    <MuiThemeProvider >
      <div>
        <Toolbar/>
        <PrList/>
      </div>
    </MuiThemeProvider>
  </Provider>
);

ReactDOM.render(<Main/>, document.getElementById('root'));
