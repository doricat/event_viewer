import React from 'react';
import { InputGroup, DropdownButton, Dropdown, FormControl, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ReactDatePicker.css';

class EventFilter extends React.Component {
    constructor(props) {
        super(props);

        const { level, startTime, endTime } = props;

        this.state = {
            isSubmitting: false,
            level: level,
            startTime: startTime,
            endTime: endTime
        }
    }

    select(level) {
        this.setState({
            level: level
        });
    }

    change(key, time) {
        var obj = key === "startTime" ? { startTime: time } : { endTime: time };
        this.setState(obj);
    }

    search() {
        this.setState({ isSubmitting: true });
        const { level, startTime, endTime } = this.state;
        this.props.onQuery(level, startTime, endTime, () => {
            this.setState({ isSubmitting: false });
        });
    }

    UNSAFE_componentWillMount() {
        if (this.props.fromSummary === true) {
            this.search();
        }
    }

    render() {
        const { isSubmitting } = this.state;
        return (
            <InputGroup className="mb-3">
                <DropdownButton
                    as={InputGroup.Prepend}
                    variant="outline-secondary"
                    title={this.state.level}
                    id="input-group-dropdown-1"
                    disabled={isSubmitting}
                >
                    <Dropdown.Item eventKey="All" onSelect={(x) => this.select(x)}>All</Dropdown.Item>
                    <Dropdown.Item eventKey="Critical" onSelect={(x) => this.select(x)}>Critical</Dropdown.Item>
                    <Dropdown.Item eventKey="Error" onSelect={(x) => this.select(x)}>Error</Dropdown.Item>
                    <Dropdown.Item eventKey="Warning" onSelect={(x) => this.select(x)}>Warning</Dropdown.Item>
                    <Dropdown.Item eventKey="Info" onSelect={(x) => this.select(x)}>Info</Dropdown.Item>
                    <Dropdown.Item eventKey="Debug" onSelect={(x) => this.select(x)}>Debug</Dropdown.Item>
                    <Dropdown.Item eventKey="Trace" onSelect={(x) => this.select(x)}>Trace</Dropdown.Item>
                </DropdownButton>
                <DatePicker
                    customInput={<FormControl />}
                    showTimeSelect timeFormat="HH:mm"
                    timeIntervals={5}
                    dateFormat="yyyy/MM/dd HH:mm"
                    timeCaption="time"
                    selected={this.state.startTime}
                    disabled={isSubmitting}
                    onChange={(x) => this.change("startTime", x)} />
                <Button disabled variant="light">-</Button>
                <DatePicker
                    customInput={<FormControl />}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={5}
                    dateFormat="yyyy/MM/dd HH:mm"
                    timeCaption="time"
                    selected={this.state.endTime}
                    disabled={isSubmitting}
                    onChange={(x) => this.change("endTime", x)} />
                <Button disabled={isSubmitting} onClick={() => this.search()}>查询</Button>
            </InputGroup>
        );
    }
}

export default EventFilter;