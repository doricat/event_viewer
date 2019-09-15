import React from 'react';
import Layout from '../components/Layout';

class Logout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: undefined
        };
    }

    render() {
        return (
            <Layout>
                Test
            </Layout>
        );
    }
}

export default Logout;