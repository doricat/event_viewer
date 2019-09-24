import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export const loading = (WrappedComponent, LoadingComponent) => {
    class NewComponent extends React.Component {
        UNSAFE_componentWillMount() {
            
        }

        render() {
            if (this.props.loading === true) {
                return (<LoadingComponent {...this.props} />);
            }

            return (<WrappedComponent {...this.props} />);
        }
    }

    hoistNonReactStatics(NewComponent, WrappedComponent);

    return NewComponent;
};