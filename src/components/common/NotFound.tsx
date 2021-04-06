import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = (): JSX.Element => {
    return (
        <div className="not-found">
            <div className="not-found--wrapper">
                <h1>not 404 found</h1>

                <Link to="/">
                    <button>Return Home</button>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
