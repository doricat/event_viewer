import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { getStyle } from './eventLevelStyle';

class EventList extends React.Component {
    constructor(props) {
        super(props);

        this.Bottom = React.createRef();
        this.Box = React.createRef();

        this.eventScroll = this.eventScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.eventScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.eventScroll);
    }

    eventScroll() {
        const boxHeight = this.Box.current.offsetParent.clientHeight + 54 /*filter height*/ + 73 /*nav height*/ + 16 /*nav margin bottom*/;
        const yOffset = window.pageYOffset + window.innerHeight;

        if (yOffset >= boxHeight) {
            this.props.loadMore();
        }
    }

    render() {
        const items = this.props.list.map((x) => {
            const style = getStyle(x.level);

            return (
                <Alert variant={style} key={x.id.toString()}>
                    <Alert.Heading>{x.level}</Alert.Heading>
                    <p>{x.message}</p>
                    <hr />
                    <p className="mb-0">{x.category} - {x.timestamp.toLocaleString()}</p>
                    <div className="d-flex justify-content-end">
                        <Button variant="outline-info">在新窗口查看</Button>
                    </div>
                </Alert>
            );
        });

        if (items.length === 0) {
            items.push(
                <Alert variant="success" key="-1">
                    暂无数据
                </Alert>
            );
        }

        return <div ref={this.Box}>{items}<div ref={this.Bottom}></div></div>;
    }
}

export default EventList;