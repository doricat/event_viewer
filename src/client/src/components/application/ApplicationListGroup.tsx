import React from 'react';
import { Route, Link } from 'react-router-dom';

interface Props {
    path: string;
    applications: [number, string][];
}

export function ApplicationListGroup(props: Props) {
    return (
        <div className="list-group">
            {props.applications.map((x) => {
                const [id, name] = x;
                const path = `${props.path}/${id}`;
                return (
                    <Route key={id.toString()}
                        path={path}
                        children={y => (
                            <Link to={path}
                                className={y.match
                                    ? 'list-group-item list-group-item-action active'
                                    : 'list-group-item list-group-item-action'}>{name}</Link>
                        )}
                    />
                );
            })}
        </div>
    );
}
