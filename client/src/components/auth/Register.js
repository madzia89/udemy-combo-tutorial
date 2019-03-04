import React, {Component} from 'react';
import axios from 'axios';
import classNames from 'classnames';

class Register extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        password2: '',
        errors: {}
    };

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

        axios.post('/api/users/register', newUser)
            .then(result => console.log('result', result.data))
            .catch(err => {
                this.setState({errors: err.response.data})
            });
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
                                <div className="form-group">

                                    <input type="text"
                                           className={classNames("form-control form-control-lg", {
                                               'is-invalid': errors.name
                                           })}
                                           placeholder="Name"
                                           name="name"
                                           value={this.state.name}
                                           onChange={(event) => this.onChange(event)}/>
                                    {errors.name && (<div className={"invalid-feedback"}>{errors.name}</div>)}
                                </div>
                                <div className="form-group">

                                    <input type="email"
                                           className={classNames("form-control form-control-lg", {
                                               'is-invalid': errors.email
                                           })}
                                           placeholder="Email Address"
                                           value={this.state.email}
                                           onChange={(event) => this.onChange(event)}
                                           name="email"/>
                                    {errors.email && (<div className={"invalid-feedback"}>{errors.email}</div>)}
                                    <small className="form-text text-muted">This site uses Gravatar so if you want a
                                        profile image, use a Gravatar email
                                    </small>
                                </div>
                                <div className="form-group">

                                    <input type="password"
                                           className={classNames("form-control form-control-lg", {
                                               'is-invalid': errors.password
                                           })}
                                           placeholder="Password"
                                           name="password"
                                           value={this.state.password}
                                           onChange={(event) => this.onChange(event)}
                                    />
                                    {errors.password && (<div className={"invalid-feedback"}>{errors.password}</div>)}

                                </div>
                                <div className="form-group">

                                    <input type="password"
                                           className={classNames("form-control form-control-lg", {
                                               'is-invalid': errors.password2
                                           })}
                                           placeholder="Confirm Password"
                                           name="password2"
                                           value={this.state.password2}
                                           onChange={(event) => this.onChange(event)}
                                    />
                                    {errors.password2 && (<div className={"invalid-feedback"}>{errors.password2}</div>)}

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

export default Register;
