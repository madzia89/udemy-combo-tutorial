import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import {getCurrentProfile, deleteAccount} from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import ProfileActions from './ProfileActions';
import Experience from './Experience';

class Dashboard extends Component {

    componentDidMount() {
        this.props.getCurrentProfile();
    }

    onDeleteClick(event) {
        this.props.deleteAccount();
    }

    render() {
        const {user} = this.props.auth;
        const {profile, loading} = this.props.profile;

        let dashboardContent;

        if (profile === null || loading) {
            // jeżeli nie ma profilu lub ładuje się
            dashboardContent = <Spinner/>
        } else {
            // Check f logged in user has profile data
            if (Object.keys(profile).length > 0) {
                dashboardContent = (
                    <div>
                        <p className={"lead text-muted"}>
                            Welcome <Link to={`/profile/${profile.handle}`}> {user.name}</Link>
                        </p>
                        <ProfileActions/>
                        <Experience experience={profile.experience}/>
                        <div style={{marginBottom: '60px'}}>
                            <button className={'btn btn-danger'}
                                    onClick={(event) => this.onDeleteClick(event)}>
                                Delete my account
                            </button>
                        </div>
                    </div>
                )
            } else {
                // User is logged in but has no profile
                dashboardContent = (
                    <div>
                        <p className={"lead text-muted"}>
                            Welcome {user.name}
                        </p>
                        <p>You have not yet setup a profile, please add some info</p>
                        <Link to={"/create-profile"} className={"btn btn-lg btn-info"}>Create profile</Link>
                    </div>
                )
            }
        }

        return (
            <div className={"dashboard"}>
                <div className={"row"}>
                    <div className={"col-md-12"}>
                        <h1 className={"display-4"}>Dashboard</h1>
                        {dashboardContent}
                    </div>
                </div>
            </div>
        )
    }
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard)
