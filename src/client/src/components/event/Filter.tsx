import React from 'react';
import { observer } from 'mobx-react';
import { EventLevel, RequestState } from '../../models/shared';
import { InputGroup, DropdownButton, Dropdown, FormControl, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { FilterModel } from '../../models/view/event';
import 'react-datepicker/dist/react-datepicker.css';
import './reactDatePicker.css';

interface Props {
    model: FilterModel;
    requestState?: RequestState;
    loadEvents: () => void;
}

export const EventFilter = observer((props: Props) => {
    const { model, requestState } = props;

    return (
        <InputGroup className="mb-3">
            <DropdownButton
                as={InputGroup.Prepend}
                variant="outline-secondary"
                title={model.level}
                id="event-level-dropdown"
                disabled={requestState?.waiting}
            >
                <Dropdown.Item eventKey="all" onSelect={() => model.level = 'all'}>all</Dropdown.Item>
                <Dropdown.Item eventKey="critical" onSelect={(x) => model.level = x as EventLevel}>critical</Dropdown.Item>
                <Dropdown.Item eventKey="error" onSelect={(x) => model.level = x as EventLevel}>error</Dropdown.Item>
                <Dropdown.Item eventKey="warning" onSelect={(x) => model.level = x as EventLevel}>warning</Dropdown.Item>
                <Dropdown.Item eventKey="information" onSelect={(x) => model.level = x as EventLevel}>information</Dropdown.Item>
                <Dropdown.Item eventKey="debug" onSelect={(x) => model.level = x as EventLevel}>debug</Dropdown.Item>
                <Dropdown.Item eventKey="trace" onSelect={(x) => model.level = x as EventLevel}>trace</Dropdown.Item>
            </DropdownButton>
            <DatePicker
                customInput={<FormControl />}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={5}
                dateFormat="yyyy/MM/dd HH:mm"
                timeCaption="time"
                selected={model.startTime}
                disabled={requestState?.waiting}
                onChange={(x) => {
                    model.startTime = x === null ? undefined : (x as Date)
                }} />
            <Button disabled variant="light">-</Button>
            <DatePicker
                customInput={<FormControl />}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={5}
                dateFormat="yyyy/MM/dd HH:mm"
                timeCaption="time"
                selected={model.endTime}
                disabled={requestState?.waiting}
                onChange={(x) => model.endTime = x === null ? undefined : (x as Date)} />
            {/* <Button disabled={requestState?.waiting} onClick={() => loadEvents()}>查询</Button> */}
        </InputGroup>
    );
});
