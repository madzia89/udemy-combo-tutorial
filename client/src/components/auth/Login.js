import React, {Component} from 'react';
import axios from 'axios';
import classNames from "classnames";

class Login extends Component {
    state = {
        email: '',
        password: '',
        errors: {}
    };

    onChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();

        const user = {
            email: this.state.email,
            password: this.state.password
        };

        axios.post('/api/users/login', user)
            .then(result => console.log('result', result.data))
            .catch(err => {
                this.setState({errors: err.response.data})
            });
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
                            <form noValidate onSubmit={() => this.onSubmit()}>
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

export default Login;
