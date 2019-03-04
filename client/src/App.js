import React, {Component} from 'react';
//Browser Router pozwala np. na zastosowanie przycisku wstecz
import {BrowserRouter as Router, Route} from "react-router-dom";
import {Provider} from 'react-redux';
import store from './store';

import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer"
import Landing from "./components/layout/Landing"
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import './App.css';


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
                        </div>
                        <Footer/>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
