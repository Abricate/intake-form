import 'core-js/fn/array/includes';
import 'core-js/fn/array/find';
import 'core-js/fn/string/starts-with';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { observeStore } from './store';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

/* global Raven */
observeStore(
  state => state.contactInfo.email,
  email => Raven.setUserContext({
    email
  })
);

