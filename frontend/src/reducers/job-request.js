import { combineReducers } from 'redux'
import _ from 'lodash';

import {
  ADD_FILES_TO_JOB_REQUEST,
  REMOVE_FILE_FROM_JOB_REQUEST,
  SET_JOB_REQUEST,
  SET_JOB_REQUEST_ERROR
} from '../actions';


const EmptyJobRequest = {
  quantity: 1
}

function files(state = [{ filename: 'test', originalName: 'foo'}], action) {
  switch(action.type) {
    case ADD_FILES_TO_JOB_REQUEST:
      return state.concat(action.files)

    case REMOVE_FILE_FROM_JOB_REQUEST:
      return _.without(state, action.file)
  }

  return state;
}

function props(state = EmptyJobRequest, action) {
  switch(action.type) {
    case SET_JOB_REQUEST:
      return {
        ...state,
        [action.field]: action.value
      };
  }

  return state;
}

function validationErrors(state = {}, action) {
  switch(action.type) {
    case SET_JOB_REQUEST_ERROR:
      return {
        ...state,
        [action.field]: action.error
      };
  }

  return state;
}

export default combineReducers({
  files,
  props,
  validationErrors
})
