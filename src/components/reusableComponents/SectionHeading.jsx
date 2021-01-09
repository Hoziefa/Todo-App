import React from "react";

const SectionHeading = ({ icon, title, children }) => {
    return (
        <div className="section-heading">
            <div className="section-icon">{icon}</div>
            <h5 className="section-title">{title}</h5>
            {children}
        </div>
    );
};

export default SectionHeading;
