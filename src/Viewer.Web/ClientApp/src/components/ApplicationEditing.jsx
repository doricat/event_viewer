import React from 'react';
import ApplicationEditingForm from '../components/ApplicationEditingForm';

class ApplicationEditingPage extends React.Component {

    render() {
        return (
            <ApplicationEditingForm application={null} cancel={() => this.props.history.goBack()} />
        );
    }
}

export default ApplicationEditingPage;