import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { getStyle } from './eventLevelStyle';

class EventList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            list: []
        };

        this.Box = React.createRef();
        this.eventScroll = this.eventScroll.bind(this);
        this.renderCompeted = true;
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.dataCount) {
            return {
                list: []
            };
        }

        if (props.list.length > 0) {
            const items = props.list.map((x) => {
                const style = getStyle(x.level);

                return (
                    <Alert variant={style} key={x.id.toString()}>
                        <Alert.Heading>{x.level}</Alert.Heading>
                        <p>{x.message}</p>
                        <hr />
                        <p className="mb-0">{x.category} - {new Date(x.timestamp).toLocaleString()}</p>
                        <div className="d-flex justify-content-end">
                            <Button variant="outline-info">在新窗口查看</Button>
                        </div>
                    </Alert>
                );
            });

            let list = props.dataCount ? [...state.list] : [];
            list.push.apply(list, items);
            return {
                list
            };
        }

        return null;
    }

    componentDidMount() {
        window.addEventListener("scroll", this.eventScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.eventScroll);
    }

    componentDidUpdate() {
        this.renderCompeted = true;
    }

    eventScroll() {
        const boxHeight = this.Box.current.offsetParent.clientHeight + 54 /*filter height*/ + 73 /*nav height*/ + 16 /*nav margin bottom*/;
        const yOffset = window.pageYOffset + window.innerHeight;

        if (yOffset >= boxHeight && this.renderCompeted === true) {
            this.renderCompeted = false;
            this.props.loadMore();
        }
    }

    render() {
        let message = undefined;
        if (this.state.list.length === 0) {
            message = "暂无数据";
        } else if (this.props.dataCount && this.props.dataCount === this.state.list.length) {
            message = "没有更多数据";
        }

        let footer = null;
        if (message) {
            footer = (
                <Alert variant="success" key="-1">
                    {message}
                </Alert>
            );
        }

        return (
            <div ref={this.Box}>
                {this.state.list}
                {footer}
            </div>
        );
    }
}

export default EventList;