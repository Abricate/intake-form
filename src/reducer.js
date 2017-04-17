import { combineReducers } from 'redux'

import { SET_CONTACT_INFO, SET_JOB_REQUEST } from './actions';

function contactInfo(state = {country: 'United States'}, action) {
  switch(action.type) {
    case SET_CONTACT_INFO:
      return {...state, [action.field]: action.value};
    default:
      return state;
  }
}

function jobRequest(state = {}, action) {
  switch(action.type) {
    case SET_JOB_REQUEST:
      return {...state, [action.field]: action.value};
    default:
      return state;
  }
}

export default combineReducers({
  contactInfo,
  jobRequest
});
