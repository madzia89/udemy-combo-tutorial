import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {registerUser} from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        password2: '',
        errors: {}
    };

    // Prevent from access to SignUp or Login wen user is already logged in
    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard')
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({errors: nextProps.errors})
        }
    }

    onChange(event) {
        // W zależności od 'name' w inpucie, zmieni się wartość state
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();

        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2,
        };
        // this.props.history pozwoli na redirect w ramach tej samej akcji
        this.props.registerUser(newUser, this.props.history);

    }

//    Poniższy zapis pozwala na warunkowe nadanie klas.
//    W nawiasach okrągłych są defaultowe klasy, po przecinku jest warunkowo nadana klasa gdy istnieje error.name

//     className={classNames("form-control form-control-lg", {
//     'is-invalid': errors.name
//      })}

    render() {

        const {errors} = this.state;

        return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">Create your DevConnector account</p>
                            <form noValidate onSubmit={(event) => this.onSubmit(event)}>
                                <TextFieldGroup placeholder={"Name"}
                                                onChange={event => this.onChange(event)}
                                                value={this.state.name}
                                                name={'name'}
                                                error={errors.name}/>

                                <TextFieldGroup placeholder={"Email Address"}
                                                type={'email'}
                                                onChange={event => this.onChange(event)}
                                                value={this.state.email}
                                                name={'email'}
                                                error={errors.email}
                                                info={'This site uses Gravatar so if you want a profile image, use a Gravatar email'}/>

                                <TextFieldGroup placeholder={"Password"}
                                                type={'password'}
                                                onChange={event => this.onChange(event)}
                                                value={this.state.password}
                                                name={'password'}
                                                error={errors.password}/>

                                <TextFieldGroup placeholder={"Repeat password"}
                                                type={'password'}
                                                onChange={event => this.onChange(event)}
                                                value={this.state.password2}
                                                name={'password2'}
                                                error={errors.password2}/>

                                <input type="submit" className="btn btn-info btn-block mt-4"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
});

// withRouter umożliwi redirect po zarajestrowaniu do logowania
export default connect(mapStateToProps, {registerUser})(withRouter(Register));
