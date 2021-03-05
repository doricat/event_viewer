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
                            return (
                                <Link to={{ pathname: props.path, search: `?application=${id}` }}
                                    className={active
                                        ? 'list-group-item list-group-item-action active'
                                        : 'list-group-item list-group-item-action'}>{name}</Link>
                            );
                        }}
                    />
                );
            })}
        </div>
    );
}
