import React from 'react';
import { Route, Link } from 'react-router-dom';

export function ApplicationListGroup(props: { path: string; applications: [number, string][]; }) {
    return (
        <div className="list-group">
            {props.applications.map((x) => {
                const [id, name] = x;
                return (
                    <Route key={id.toString()}
                        path={props.path}
                        children={y => {
                            const params = new URLSearchParams(y.location.search);
                            const active = params.get('application') === id.toString();
                            const className = 'list-group-item list-group-item-action' + (active ? ' active' : '');
                            return (<Link to={{ pathname: props.path, search: `?application=${id}` }} className={className}>{name}</Link>);
                        }}
                    />
                );
            })}
        </div>
    );
}
