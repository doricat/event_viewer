import React from 'react';
import { Button, Alert, CardColumns } from 'react-bootstrap';
import SubscriberCard from './ApplicationEventSubscriberCard';
import { loading } from './Loading';

export class ApplicationEventSubscriberSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            userList: [...props.application.userList]
        };
    }

    handleSelect(userId) {
        let userList = [...this.state.userList];
        const index = userList.findIndex(x => x === userId);
        if (index === -1) {
            userList.push(userId);
        } else {
            userList.splice(index, 1);
        }
        this.setState({ userList });
    }

    save() {
        this.setState({ isSubmitting: true });
    }

    UNSAFE_componentWillMount() {
        const { location, match, loadUsers, loadDetail } = this.props;
        if (location.state === undefined && this.props.loading === false) {
            loadDetail(match.params.id);
            loadUsers();
        }
    }

    render() {
        if (this.props.users && this.props.users.length > 0) {
            const { isSubmitting } = this.state;

            return (
                <>
                    <CardColumns style={{ columnCount: "5" }}>
                        {this.props.users.map(user => (
                            <SubscriberCard
                                user={user}
                                selected={this.state.userList.findIndex(x => x === user.id) !== -1}
                                select={(x, y) => this.handleSelect(x, y)}
                                isSubmitting={isSubmitting}
                                key={user.id.toString()} />))}
                    </CardColumns>

                    <br />
                    <Button variant="primary" className="mr-2" disabled={isSubmitting} onClick={() => this.save()}>保存</Button>
                    <Button variant="secondary" disabled={isSubmitting} onClick={() => this.props.cancel()}>放弃</Button>
                </>
            );
        }

        return LoadingAlert();
    }
}

const LoadingAlert = () => (<Alert variant="info"><i>加载中...</i></Alert>);

export default loading(ApplicationEventSubscriberSelector, LoadingAlert);