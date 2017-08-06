import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import ReactDOM from 'react-dom';
import createSagaMiddleware from 'redux-saga'

import rootSaga from './sagas'

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import rootReducer from './reducers';

import 'bootstrap/dist/css/bootstrap.css';

const sagaMiddleware = createSagaMiddleware()

const middleware = [sagaMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer, /* preloadedState, */
  compose(
    applyMiddleware(...middleware)
  )
);

ReactDOM.render(
  <Provider store={store}>
  <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
