import { combineReducers } from 'redux'
import _ from 'lodash';

import jobRequest from './reducers/job-request';

import {
  ADD_TO_CART,
  SET_CONTACT_INFO,
} from './actions';

const defaultContactInfoForTesting = {
  name: 'Foobar Baz',
  email: 'foo@example.com',
  phoneNumber: '(123) 456-7890',
  address1: '1234 Foo Lane',
  zipcode: '90210',
  country: 'United States'
}


function contactInfo(state = {country: 'United States', ...defaultContactInfoForTesting}, action) {
  switch(action.type) {
    case SET_CONTACT_INFO:
      return {...state, [action.field]: action.value};
    default:
      return state;
  }
}

function cart(state = [], action) {
  switch(action.type) {
    case ADD_TO_CART:
      return [...state, action.jobRequest];
    default:
      return state;
  }
}

export default combineReducers({
  contactInfo,
  jobRequest,
  cart
});
