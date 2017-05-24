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

