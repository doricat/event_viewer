import React from 'react';
import { Alert } from 'react-bootstrap';
import { HubConnectionBuilder, LogLevel, } from '@aspnet/signalr';
import { getStyle } from './eventLevelStyle';
import authorizeService from '../services/AuthorizeService';

const boxSize = 250;

class EventBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            autoScroll: true,
            list: [],
            flowState: undefined
        };

        this.Bottom = React.createRef();
        this.Box = React.createRef();
        this.eventScroll = this.eventScroll.bind(this);

        this.token = authorizeService.getAccessToken();

        this.connection = new HubConnectionBuilder()
            .withUrl(`https://localhost:44359/EventHub?application=${this.props.appId}`, { accessTokenFactory: () => this.token })
            .configureLogging(LogLevel.Information)
            .build();

        this.connection.on("ReceiveMessage",
            args => {
                const list = [...this.state.list];
                if (list.length > boxSize) {
                    list.shift();
                }

                const style = getStyle(args.level);
                list.push(
                    <Alert variant={style} key={args.id.toString()}>
                        <Alert.Heading>{args.level}</Alert.Heading>
                        <p>{args.message}</p>
                        <hr />
                        <p className="mb-0">{args.category} - {new Date(args.timestamp).toLocaleString()}</p>
                    </Alert>
                );

                this.setState({ list });
            });
    }

    componentWillUnmount() {
        this.connection.stop();
        window.removeEventListener("scroll", this.eventScroll);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.eventScroll);

        this.connection.start()
            .then(() => {
                this.setState({ flowState: "connected" });
                var params = new URLSearchParams(this.connection.connection.transport.webSocket.url);
                this.props.connectedCallback(params.get("id"));
            })
            .catch(error => console.error(error.toString()));
    }

    componentDidUpdate() {
        if (this.state.autoScroll) {
            this.Bottom.current.scrollIntoView();
        }
    }

    eventScroll() {
        const boxHeight = this.Box.current.offsetParent.clientHeight + 80;
        const yOffset = window.pageYOffset + window.innerHeight;
        if (yOffset >= boxHeight) {
            if (this.state.autoScroll === true) return;
            this.setState({ autoScroll: true });
        } else {
            if (this.state.autoScroll === false) return;
            this.setState({ autoScroll: false });
        }
    }

    render() {
        let message = undefined;
        if (!this.state.flowState) {
            message = "连接中...";
        } else if (this.state.flowState === "connected") {
            message = "连接成功，等待数据...";
        }

        let footer = null;
        if (message && this.state.list.length === 0) {
            footer = (
                <Alert variant="info" key="-1">
                    {message}
                </Alert>
            );
        }

        return (
            <div ref={this.Box}>
                {this.state.list}
                {footer}
                <div ref={this.Bottom}></div>
            </div>
        );
    }
}

export default EventBox;