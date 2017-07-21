import { combineReducers } from 'redux';

import { SET_USER } from '../actions';

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

export default combineReducers({
  user
});
