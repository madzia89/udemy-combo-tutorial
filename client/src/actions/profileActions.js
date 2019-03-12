import axios from 'axios';
import {GET_PROFILE, GET_ERRORS, PROFILE_LOADING, CLEAR_CURRENT_PROFILE} from "./types";

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios.get('/api/profile')
      .then(response => {
          dispatch({
              type: GET_PROFILE,
              payload: response.data
          })
      })
      // jeżeli nie jes zwracany profile to dajemy pusty obiekt żeby przy braku jakiegokolwiek profilu możne było działac a nie segregować błędy
      .catch(err => dispatch({
          type: GET_PROFILE,
          payload: {}
      }))
};


// Profile loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    }
};


export const clearCurrentProfile= () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    }
};
