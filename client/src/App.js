import React, {Component} from 'react';
//Browser Router pozwala np. na zastosowanie przycisku wstecz
import {BrowserRouter as Router, Route} from "react-router-dom";
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {logoutUser, setCurrentUser} from "./actions/authActions";
import {clearCurrentProfile} from './actions/profileActions'

import {Provider} from 'react-redux';
import store from './store';

import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer"
import Landing from "./components/layout/Landing"
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from './components/dashboard/Dashboard'

import './App.css';

// Check for token
if (localStorage.jwtToken) {
    //Set auth token header auth
    setAuthToken(localStorage.jwtToken);
    // Decode token and get user info + expiration
    const decoded = jwt_decode(localStorage.jwtToken);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    // check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());
        store.dispatch(clearCurrentProfile());
        window.location.href = '/login'
    }
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div>
                        <NavBar/>
                        <Route exact path={"/"} component={Landing}/>
                        <div className={"container"}>
                            <Route exact path={"/register"} component={Register}/>
                            <Route exact path={"/login"} component={Login}/>
                            <Route exact path={"/dashboard"} component={Dashboard}/>
                        </div>
                        <Footer/>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
