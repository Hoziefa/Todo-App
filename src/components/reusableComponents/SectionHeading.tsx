import React from 'react';

export const SectionHeading: React.FC<{ icon?: string; title: string }> = ({ icon, title, children }): JSX.Element => (
    <div className="section-heading">
        <div className="section-icon">{ icon ?? <i className="fas fa-list" /> }</div>
        <h2 className="section-title">{ title }</h2>
        { children }
    </div>
);
