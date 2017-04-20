import { combineReducers } from 'redux'
import _ from 'lodash';

import {
  ADD_FILES_TO_JOB_REQUEST,
  ADD_TO_CART,
  REMOVE_FILE_FROM_JOB_REQUEST,
  SET_CONTACT_INFO,
  SET_JOB_REQUEST,
} from './actions';

function contactInfo(state = {country: 'United States'}, action) {
  switch(action.type) {
    case SET_CONTACT_INFO:
      return {...state, [action.field]: action.value};
    default:
      return state;
  }
}

const EmptyJobRequest = {
  files: [{ filename: 'test', originalName: 'foo'}],
  quantity: 1
}
function jobRequest(state = EmptyJobRequest, action) {
  switch(action.type) {
    case SET_JOB_REQUEST:
      return {
        ...state,
        [action.field]: action.value
      };
      
    case ADD_FILES_TO_JOB_REQUEST:
      return {
        ...state,
        files: state.files.concat(action.files)
      };

    case REMOVE_FILE_FROM_JOB_REQUEST:
      return {
        ...state,
        files: _.without(state.files, action.file)
      };
      
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
