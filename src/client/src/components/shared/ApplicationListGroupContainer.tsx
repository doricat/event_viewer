import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../../stores';
import { Loading } from '../Loading';

interface Props {
    path: string;
    component: (props: { path: string; applications: [number, string][]; }) => JSX.Element;
}

export const ApplicationListGroupContainer = observer((props: Props) => {
    const context = useContext(StoreContext);
    if (context.application.applications == null) {
        return (<Loading />);
    }

    const applications: [number, string][] = [];
    context.application.applications
        .slice()
        .filter(x => x.removed === false)
        .sort(x => x.id)
        .map(x => applications.push([x.id, x.name]));

    return React.createElement(props.component, { applications, path: props.path });
});
