import { combineReducers } from 'redux'
import _ from 'lodash';

import jobRequest from './reducers/job-request';

import {
  ADD_TO_CART,
  SET_CONTACT_INFO,
  JOB_REQUEST_SUBMITTED
} from './actions';

const defaultContactInfoForTesting = {
  name: 'Foobar Baz',
  email: 'foo@example.com',
  phoneNumber: '(123) 456-7890',
  address1: '1234 Foo Lane',
  zipcode: '90210',
  country: 'United States'
}

function contactInfo(state = {country: 'United States', /*...defaultContactInfoForTesting*/}, action) {
  switch(action.type) {
    case SET_CONTACT_INFO:
      return {...state, [action.field]: action.value};
    default:
      return state;
  }
}

const defaultCartForTesting = [{
  files: [
    {
      filename: 'test',
      originalName: 'foo'
    }
  ],
  props: {
    quantity: 1,
    material: 'Delrin',
    materialThickness: '1/4"',
    sheetMetalGage: '28'
  },
  validationErrors: {}
}];

function cart(state = [] /*defaultCartForTesting*/, action) {
  switch(action.type) {
    case ADD_TO_CART:
      return [...state, action.jobRequest];
    case JOB_REQUEST_SUBMITTED:
      return [];
    default:
      return state;
  }
}

export default combineReducers({
  contactInfo,
  jobRequest,
  cart
});
