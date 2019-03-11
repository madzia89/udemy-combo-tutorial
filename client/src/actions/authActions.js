import axios from 'axios';
import {GET_ERRORS, SET_CURRENT_USER} from "./types";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from 'jwt-decode';

// Register User

export const registerUser = (userData, history) => (dispatch) => {
    axios.post('/api/users/register', userData)
        .then(result => history.push('/login'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Login - get user token

export const loginUser = (userData) => (dispatch) => {
    axios.post('/api/users/login', userData)
        .then(result => {
            // Save to local storage
            const {token} = result.data;
            localStorage.setItem('jwtToken', token);

            // Set token to Auth header
            setAuthToken(token);

            // // Decode token to get user data
            const decoded = jwt_decode(token);

            // // Set current user
            dispatch(setCurrentUser(decoded))
        })
        .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            }
        )
};


// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
};
