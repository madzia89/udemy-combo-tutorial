import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import PropTypes from 'prop-types';
import {Link, withRouter} from "react-router-dom";
import {TextFieldGroup, TextAreaFieldGroup} from '../common'
import {addEducation} from '../../actions/profileActions'

class AddEducation extends Component {

    state = {
        school: '',
        degree: '',
        fieldOfStudy: '',
        from: '',
        to: '',
        current: false,
        description: '',
        errors: {},
        disabled: false
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.errors) {
            this.setState({errors: nextProps.errors})
        }
    }

    onChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }

    onSubmit(event) {
        event.preventDefault();
        const eduData = {
            school: this.state.school,
            degree: this.state.degree,
            fieldOfStudy: this.state.fieldOfStudy,
            from: this.state.from,
            to: this.state.to,
            current: this.state.current,
            description: this.state.description
        };

        this.props.addEducation(eduData, this.props.history);
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
            <div className={'add-education'}>

                <div className={'row'}>
                    <div className={'col-md-8 m-auto'}>
                        <Link to={'/dashboard'} className={'btn btn-light'}>
                            Go back
                        </Link>
                        <h1 className={'display-4 text-center'}>Add education </h1>
                        <p className={'lead text-center'}> Add any school, bootcamp etc. that you have attended</p>
                        <small className={'d-block pb-3'}>* = required fields</small>
                        <form onSubmit={(event) => this.onSubmit(event)}>
                            <TextFieldGroup placeholder={'* School'}
                                            type={'text'}
                                            onChange={(event) => this.onChange(event)}
                                            value={this.state.school}
                                            name={'school'}
                                            error={errors.school}
                            />
                            <TextFieldGroup placeholder={'* Degree or Certification'}
                                            type={'text'}
                                            onChange={(event) => this.onChange(event)}
                                            value={this.state.degree}
                                            name={'degree'}
                                            error={errors.degree}
                            />
                            <TextFieldGroup placeholder={'Field of Study'}
                                            type={'text'}
                                            onChange={(event) => this.onChange(event)}
                                            value={this.state.fieldOfStudy}
                                            name={'fieldOfStudy'}
                                            error={errors.fieldOfStudy}
                            />
                            <h6>From Date</h6>

                            <TextFieldGroup type={'date'}
                                            onChange={(event) => this.onChange(event)}
                                            value={this.state.from}
                                            name={'from'}
                                            error={errors.from}
                            />
                            <h6>To Date</h6>

                            <TextFieldGroup type={'date'}
                                            onChange={(event) => this.onChange(event)}
                                            value={this.state.to}
                                            name={'to'}
                                            error={errors.to}
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
                                <label htmlFor={'current'} className={'form-check-label'}>Current school</label>
                            </div>
                            <TextAreaFieldGroup
                                placeholder={'Program description'}
                                onChange={(event) => this.onChange(event)}
                                value={this.state.description}
                                name={'description'}
                                error={errors.description}
                                info={'Tell us about the program that you were in'}
                            />
                            <input type={'submit'} value={'Submit'} className={'btn btn-info btn-block mt4'}/>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
});

export default connect(mapStateToProps, {addEducation})(withRouter(AddEducation));
