import axios from 'axios';
import {GET_PROFILE, GET_ERRORS, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, SET_CURRENT_USER} from "./types";

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

export const createCurrentProfile = (profileData, history) => dispatch => {
    axios.post('/api/profile', profileData)
        .then(result => history.push('/dashboard'))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }))
};

// Delete account and profile
export const deleteAccount = () => dispatch => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
        axios.delete('/api/profile')
            .then(res => dispatch({
                // when we delete the user, we want to set current user to {} so no one is logged in
                type: SET_CURRENT_USER,
                payload: {}
            }))
            .catch(err => dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            }))
    }
};


// Profile loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    }
};


export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    }
};
