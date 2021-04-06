import React from 'react';

export const SectionHeading: React.FC<{ icon?: string; title: string }> = ({ icon, title, children }): JSX.Element => (
    <div className="section-heading">
        <div className="section-icon">{icon || <i className="fas fa-list"></i>}</div>
        <h5 className="section-title">{title}</h5>
        {children}
    </div>
);
