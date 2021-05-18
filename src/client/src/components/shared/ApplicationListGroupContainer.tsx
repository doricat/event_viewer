import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Loading } from '../Loading';
import { MyContext } from '../../configureStore';

interface Props {
    path: string;
    component: (props: { path: string; applications: [number, string][]; }) => JSX.Element;
}

export const ApplicationListGroupContainer = observer((props: Props) => {
    const context = useContext(MyContext);
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
