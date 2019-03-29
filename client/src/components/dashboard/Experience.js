import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import PropTypes from 'prop-types';
import Moment from 'react-moment'
import {deleteExperience} from '../../actions/profileActions';

class Experience extends Component {
    onDeleteClick(ev, id) {
        this.props.deleteExperience(id)
    }

    render() {

        const experience = this.props.experience.map(exp => (
            <tr key={exp._id}>
                <td>{exp.company}</td>
                <td>{exp.title}</td>
                <td><Moment format={"YYYY/MM/DD"}>{exp.from}</Moment> - {exp.to === null ? ('Now') : (
                    <Moment format={"YYYY/MM/DD"}>{exp.to}</Moment>)}</td>
                <td>
                    <button className={'btn btn-danger'} onClick={(ev) => this.onDeleteClick(ev, exp._id)}>Delete
                    </button>
                </td>
            </tr>
        ));

        return (
            <div>
                <h4 className={'mb-4'}>Experience</h4>
                <table className={'table'}>
                    <thead>
                    <tr>
                        <th>Company</th>
                        <th>Title</th>
                        <th>Years</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {experience}
                    </tbody>
                </table>
            </div>
        )
    }
}


Experience.propTypes = {
    deleteExperience: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {deleteExperience})(Experience)
