import React from 'react';
import { Card } from 'react-bootstrap';

const style = {
    cursor: "pointer"
};

class SubscriberCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            bg: "light",
            textColor: ""
        }
    }

    select(id) {
        if (this.props.isSubmitting === true) {
            return;
        }

        this.props.select(id);
    };

    render() {
        const { user } = this.props;
        return (
            <Card style={style} onClick={() => this.select(user.id)} border={this.props.selected === true ? "primary" : "light"}>
                <Card.Img variant="top" src={user.avatar} />
                <Card.Body>
                    {user.name}
                </Card.Body>
            </Card>
        );
    }
}

export default SubscriberCard;