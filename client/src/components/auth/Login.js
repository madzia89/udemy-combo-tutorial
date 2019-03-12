import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {loginUser} from "../../actions/authActions";
import {withRouter} from "react-router-dom";
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {
    state = {
        email: '',
        password: '',
        errors: {}
    };

    // Prevent from access to SignUp or Login wen user is already logged in
    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard')
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {

        if (nextProps.auth.isAuthenticated) {
            this.props.history.push('/dashboard')
        }


        if (nextProps.errors) {
            this.setState({errors: nextProps.errors});
        }
    }

    onChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password
        };

        this.props.loginUser(userData);
    }

    render() {

        const {errors} = this.state;

        return (
            <div className="login">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Log In</h1>
                            <p className="lead text-center">Sign in to your DevConnector account</p>
                            <form noValidate onSubmit={(event) => this.onSubmit(event)}>
                                <TextFieldGroup placeholder={"Email Address"}
                                                type={'email'}
                                                onChange={event => this.onChange(event)}
                                                value={this.state.email}
                                                name={'email'}
                                                error={errors.email}/>
                                <TextFieldGroup placeholder={"Password"}
                                                type={'password'}
                                                onChange={event => this.onChange(event)}
                                                value={this.state.password}
                                                name={'password'}
                                                error={errors.password}/>
                                <input type="submit" className="btn btn-info btn-block mt-4"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, {loginUser})(withRouter(Login));
