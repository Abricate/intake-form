import { combineReducers } from 'redux'
import _ from 'lodash';
import moment from 'moment';

import {
  ADD_TO_CART,
  ADD_FILES_TO_JOB_REQUEST,
  REMOVE_FILE_FROM_JOB_REQUEST,
  SET_JOB_REQUEST,
  JOB_REQUEST_SUBMITTED
} from '../actions';

const isDev = process.env.NODE_ENV === 'development';

const EmptyJobRequest = {
  quantity: 1,
  dueDate: moment().add(7, 'days').format('YYYY-MM-DD'),
};

const TestEmptyJobRequest = {
  ...EmptyJobRequest,
  _materialCategory: 'Metal',
  material: 'Hot Rolled Steel'
};

const TestFiles = [{ filename: 'test', originalName: 'foo'}];

function files(state = isDev ? TestFiles : [], action) {
  switch(action.type) {
    case ADD_FILES_TO_JOB_REQUEST:
      return state.concat(action.files);

    case REMOVE_FILE_FROM_JOB_REQUEST:
      return _.without(state, action.file);
  }

  return state;
}

function props(state = isDev ? TestEmptyJobRequest : EmptyJobRequest, action) {
  switch(action.type) {
    case SET_JOB_REQUEST:
      return {
        ...state,
        [action.field]: action.value !== '' ? action.value : undefined
      };
  }

  return state;
}

function empty(state = true, action) {
  switch(action.type) {
    case SET_JOB_REQUEST:
    case ADD_FILES_TO_JOB_REQUEST:
      return false;
  }

  return state;
}

const jobRequestReducer = combineReducers({
  files,
  props,
  empty
});

// reset jobRequest to default state on ADD_TO_CART or JOB_REQUEST_SUBMITTED
export default (_state, action) => {
  const state = [ADD_TO_CART, JOB_REQUEST_SUBMITTED].includes(action.type) ? undefined : _state;
  
  return jobRequestReducer(state, action);
};
