import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const ScrollToTop: React.FC<RouteComponentProps> = ({ location }): JSX.Element => {
    useEffect((): void => window.scrollTo(0, 0), [location]);

    return <React.Fragment />;
};

export default withRouter(ScrollToTop);
