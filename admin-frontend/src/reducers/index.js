import _ from 'lodash';
import { combineReducers } from 'redux';

import { ADD_JOBS_TO_INVOICE, SET_USER } from '../actions';

const user = (state = {}, action) => {
  switch(action.type) {
    case SET_USER:
      return {
        ...action.user,
        isLoggedIn: true
      };
  }

  return state;
}

const invoice = (state = {jobIds: {}}, action) => {
  switch(action.type) {
    case ADD_JOBS_TO_INVOICE:
      const newJobIds = _.fromPairs(action.jobIds.map( jobId => [jobId, true] ));
      
      return {
        jobIds: {...state.jobIds, newJobIds}
      };
  }

  return state;
}

export default combineReducers({
  user,
  invoice
});
