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
                        children={y => {
                            const className = 'list-group-item list-group-item-action' + (y.match ? ' active' : '');
                            return (<Link to={path} className={className}>{name}</Link>);
                        }}
                    />
                );
            })}
        </div>
    );
}
