import React from 'react';
import { objectUtils } from '../../utils';

interface IFieldProps {
    classAttr: { error?: boolean, active?: boolean, defaultList?: Array<string> };
    label?: string;
    icon?: string;
    noValidate?: boolean;
    displayError?: boolean;
    errorElement: false | JSX.Element;
}

export const Field: React.FC<IFieldProps> = ({ classAttr: { defaultList = [], ...classAttr }, children, errorElement, icon, label, noValidate, displayError = true }): JSX.Element => {
    return <div className={ `field ${ objectUtils.extractClassesAttrs(classAttr!) } ${ defaultList?.join(' ') }`.trim() }>
        { label && <label>{ label }</label> }

        { icon && <i className={ `${ icon }` } /> }

        { children }

        { !noValidate && displayError && errorElement }
    </div>;
};
