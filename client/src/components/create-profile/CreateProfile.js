import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import {InputGroup, SelectListGroup, TextFieldGroup, TextAreaFieldGroup} from '../common';
import {createCurrentProfile} from "../../actions/profileActions";

class CreateProfile extends Component {

    state = {
        displaySocialInputs: false,
        handle: '',
        company: '',
        website: '',
        location: '',
        status: '',
        skills: '',
        githubusername: '',
        bio: '',
        twitter: '',
        facebook: '',
        linkedin: '',
        youtube: '',
        instagram: '',
        errors: {},
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.errors) {
            this.setState({errors: nextProps.errors})
        }
    }

    onChange(event) {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();

        const profileData = {
            handle: this.state.handle,
            company: this.state.company,
            website: this.state.website,
            location: this.state.location,
            status: this.state.status,
            skills: this.state.skills,
            githubusername: this.state.githubusername,
            bio: this.state.bio,
            twitter: this.state.twitter,
            facebook: this.state.facebook,
            linkedin: this.state.linkedin,
            youtube: this.state.youtube,
            instagram: this.state.instagram
        }

        this.props.createCurrentProfile(profileData, this.props.history)
    }

    render() {
        const {errors, displaySocialInputs} = this.state;

        // Select options for status
        const options = [
            {label: '* Select Professional Status', value: 0},
            {label: 'Developer', value: 'Developer'},
            {label: 'Junior Developer', value: 'Junior Developer'},
            {label: 'Senior Developer', value: 'Senior Developer'},
            {label: 'Manager', value: 'Manager'},
            {label: 'Student of Learning', value: 'Student of Learning'},
            {label: 'Instructor of Teacher', value: 'Instructor of Teacher'},
            {label: 'Intern', value: 'Intern'},
            {label: 'Other', value: 'Other'}
        ];

        let socialInputs;
        if (displaySocialInputs) {
            socialInputs = (
                <div>
                    <InputGroup placeholder={'Twitter Profile URL'}
                                onChange={(event) => this.onChange(event)}
                                name={'twitter'}
                                value={this.state.twitter}
                                error={errors.twitter}
                                icon={'fab fa-twitter'}
                                type={'url'}
                    />
                    <InputGroup placeholder={'Facebook Profile URL'}
                                onChange={(event) => this.onChange(event)}
                                name={'facebook'}
                                value={this.state.facebook}
                                error={errors.facebook}
                                icon={'fab fa-facebook'}
                                type={'url'}
                    />
                    <InputGroup placeholder={'LinkedIn Profile URL'}
                                onChange={(event) => this.onChange(event)}
                                name={'linkedin'}
                                value={this.state.linkedin}
                                error={errors.linkedin}
                                icon={'fab fa-linkedin'}
                                type={'url'}
                    />
                    <InputGroup placeholder={'YouTube Channel URL'}
                                onChange={(event) => this.onChange(event)}
                                name={'youtube'}
                                value={this.state.youtube}
                                error={errors.youtube}
                                icon={'fab fa-youtube'}
                                type={'url'}
                    />
                    <InputGroup placeholder={'Instagram Page URL'}
                                onChange={(event) => this.onChange(event)}
                                name={'instagram'}
                                value={this.state.instagram}
                                error={errors.instagram}
                                icon={'fab fa-instagram'}
                                type={'url'}
                    />
                </div>
            )
        }
        return (
            <div className={'create-profile'}>
                <div className={'container'}>
                    <div className={'row'}>
                        <div className={'col-md-8 m-auto'}>
                            <h1 className={'display-4 text-center'}>Create your profile</h1>
                            <p className={'lead text-center'}>
                                Let's get some information to make your profile stand out
                            </p>
                            <small className={'d-block pb-3'}> * = required fields</small>
                            <form onSubmit={(event) => this.onSubmit(event)}>

                                <TextFieldGroup placeholder={'* Profile Handle'}
                                                onChange={(event) => this.onChange(event)}
                                                value={this.state.handle}
                                                name={'handle'}
                                                info={'A unique handle for your profile URL. Your full name, company name, nickname'}
                                                error={errors.handle}
                                />

                                <SelectListGroup placeholder={'Status'}
                                                 onChange={(event) => this.onChange(event)}
                                                 value={this.state.status}
                                                 name={'status'}
                                                 info={'Give us an idea of where you are at in your career'}
                                                 error={errors.status}
                                                 options={options}
                                />

                                <TextFieldGroup placeholder={'Website'}
                                                onChange={(event) => this.onChange(event)}
                                                value={this.state.website}
                                                name={'website'}
                                                info={'A unique handle for your profile URL. Your full name, company name, nickname'}
                                                error={errors.website}
                                />

                                <TextFieldGroup placeholder={'Company'}
                                                onChange={(event) => this.onChange(event)}
                                                value={this.state.company}
                                                name={'company'}
                                                info={'Could be your own company or the one you work for'}
                                                error={errors.company}
                                />

                                <TextFieldGroup placeholder={'Location'}
                                                onChange={(event) => this.onChange(event)}
                                                value={this.state.location}
                                                name={'location'}
                                                info={'City or city & state suggested (eg. Boston, MA)'}
                                                error={errors.location}
                                />

                                <TextFieldGroup placeholder={'* Skills'}
                                                onChange={(event) => this.onChange(event)}
                                                value={this.state.skills}
                                                name={'skills'}
                                                info={'Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)'}
                                                error={errors.skills}
                                />

                                <TextFieldGroup placeholder={'Github Username'}
                                                onChange={(event) => this.onChange(event)}
                                                value={this.state.githubusername}
                                                name={'githubusername'}
                                                info={'If you want your latest repos and a github link, include your username'}
                                                error={errors.githubusername}
                                />

                                <TextAreaFieldGroup placeholder={'Short Bio'}
                                                    onChange={(event) => this.onChange(event)}
                                                    value={this.state.bio}
                                                    name={'bio'}
                                                    info={'Tell us a little about yourself'}
                                                    error={errors.bio}
                                />

                                <div className={'mb-3'}>
                                    <button type={'button'} className={'btn btn-light'} onClick={() => {
                                        // below toggle button
                                        this.setState(prevState => ({
                                            displaySocialInputs: !prevState.displaySocialInputs
                                        }))
                                    }}>
                                        Add social Network Links <span className={'text-muted'}> Optional</span>
                                    </button>
                                </div>
                                {socialInputs}
                                <input type={'submit'} value={'Submit'} className={'btn btn-info btn-block mt-4'}/>
                            </form>
                        </div>

                    </div>

                </div>

            </div>
        )
    }
}


CreateProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
});

export default connect(mapStateToProps, {createCurrentProfile})(withRouter(CreateProfile));
