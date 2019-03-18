import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import PropTypes from 'prop-types';
import {Link, withRouter} from "react-router-dom";
import {TextFieldGroup, TextAreaFieldGroup} from '../common'

class AddExperience extends Component {

    state = {
        company: '',
        title: '',
        location: '',
        from: '',
        to: '',
        current: false,
        description: '',
        errors: {},
        disabled: false
    };

    onChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }

    onSubmit(event) {
        event.preventDefault();
        console.log('submit')
    }

    onCheck(event) {
        this.setState({
            disabled: !this.state.disabled,
            current: !this.state.current
        })
    }

    render() {

        const {errors} = this.state;

        return (
            <div className={'add-experience'}>

                <div className={'row'}>
                    <div className={'col-md-8 m-auto'}>
                        <Link to={'/dashboard'} className={'btn btn-light'}>
                            Go back
                        </Link>
                        <h1 className={'display-4 text-center'}>Add experience </h1>
                        <p className={'lead text-center'}> Add any job or position that you have had in the past or
                            current</p>
                        <small className={'d-block pb-3'}>* = required fields</small>
                        <form onSubmit={(event) => this.onSubmit(event)}>
                            <TextFieldGroup placeholder={'* Company'}
                                            type={'text'}
                                            onChange={(event) => this.onChange(event)}
                                            value={this.state.company}
                                            name={'company'}
                                            errors={errors.company}
                            />
                            <TextFieldGroup placeholder={'* Job Title'}
                                            type={'text'}
                                            onChange={(event) => this.onChange(event)}
                                            value={this.state.title}
                                            name={'title'}
                                            errors={errors.title}
                            />
                            <TextFieldGroup placeholder={'Location'}
                                            type={'text'}
                                            onChange={(event) => this.onChange(event)}
                                            value={this.state.location}
                                            name={'location'}
                                            errors={errors.location}
                            />
                            <h6>From Date</h6>

                            <TextFieldGroup type={'date'}
                                            onChange={(event) => this.onChange(event)}
                                            value={this.state.from}
                                            name={'from'}
                                            errors={errors.from}
                            />
                            <h6>To Date</h6>

                            <TextFieldGroup type={'date'}
                                            onChange={(event) => this.onChange(event)}
                                            value={this.state.to}
                                            name={'to'}
                                            errors={errors.to}
                                            disabled={this.state.disabled ? 'disabled' : ''}
                            />
                            <div className={'form-check mb-4'}>
                                <input type={'checkbox'}
                                       className={'form-check-input'}
                                       name={'current'}
                                       value={this.state.current}
                                       checked={this.state.current}
                                       onChange={(event) => this.onCheck(event)}
                                       id={'current'}
                                />
                                <label htmlFor={'current'} className={'form-check-label'}>Current Job</label>
                            </div>
                            <TextAreaFieldGroup
                                placeholder={'Job description'}
                                onChange={(event) => this.onChange(event)}
                                value={this.state.description}
                                name={'description'}
                                error={errors.description}
                                info={'Tell us about the position'}
                            />
                            <input type={'submit'} value={'Submit'} className={'btn btn-info btn-block mt4'}/>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


AddExperience.propTypes = {
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
});

export default connect(mapStateToProps, {})(withRouter(AddExperience));
