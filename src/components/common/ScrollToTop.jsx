import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

const ScrollToTop = ({ location }) => {
    useEffect(() => window.scrollTo(0, 0), [location]);

    return <React.Fragment />;
};

export default withRouter(ScrollToTop);
