import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export const loading = (WrappedComponent, LoadingComponent) => {
    class NewComponent extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                loading: true
            };
        }

        componentDidMount() {
            if (this.props.load) {
                this.props.load(() => this.setState({ loading: false }));
            }
        }

        render() {
            if (this.state.loading === true) {
                return (<LoadingComponent {...this.props} />);
            }

            return (<WrappedComponent {...this.props} />);
        }
    }

    hoistNonReactStatics(NewComponent, WrappedComponent);

    return NewComponent;
};