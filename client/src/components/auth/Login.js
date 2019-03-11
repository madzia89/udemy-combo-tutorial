import React, {Component} from 'react';
import classNames from "classnames";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {loginUser} from "../../actions/authActions";
import {withRouter} from "react-router-dom";

class Login extends Component {
    state = {
        email: '',
        password: '',
        errors: {}
    };

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
                                <div className="form-group">
                                    <input type="email"
                                           className={classNames("form-control form-control-lg", {
                                               'is-invalid': errors.email
                                           })}
                                           placeholder="Email Address"
                                           name="email"
                                           value={this.state.email}
                                           onChange={(event) => this.onChange(event)}
                                    />
                                    {errors.email && (<div className={"invalid-feedback"}>{errors.email}</div>)}

                                </div>
                                <div className="form-group">
                                    <input type="password"
                                           className={classNames("form-control form-control-lg", {
                                               'is-invalid': errors.password
                                           })}
                                           placeholder="Password"
                                           name="password"
                                           value={this.state.password}
                                           onChange={(event) => this.onChange(event)}/>
                                    {errors.password && (<div className={"invalid-feedback"}>{errors.password}</div>)}

                                </div>
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
