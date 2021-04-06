import React, { Component, ReactNode } from 'react';
import { NavLink, Link, withRouter, RouteComponentProps } from 'react-router-dom';

import { AppContext } from '../../contexts/appContext';

import { userServices } from '../../services/UserServices';

import { CurrentUser } from 'types';

import logo from '../../assets/logo.png';

interface INavBarProps extends RouteComponentProps {
    currentUser: CurrentUser;
}

interface INavBarState {
    open: boolean;
}

class NavBar extends Component<INavBarProps, INavBarState> {
    public static contextType = AppContext;

    context!: React.ContextType<typeof AppContext>;

    public readonly state: Readonly<INavBarState> = { open: false };

    private readonly navRef = React.createRef<HTMLElement>();

    public componentDidUpdate(): void {
        const { height: navHeight } = this.navRef.current!.getBoundingClientRect();
        const domElmStyle = document.documentElement.style;

        console.log(navHeight);

        +domElmStyle.getPropertyValue('--nav-height').split('px')[0] !== navHeight && domElmStyle.setProperty('--nav-height', `${ navHeight }px`);
    }

    private logoutUser = async (): Promise<void> => {
        await userServices.auth.logoutUser();

        this.setState({ open: false });

        this.props.history.push('/');

        this.context.updateAppContext({ currentUser: null, currentUserProfile: null });
    };

    private renderLogging = (currentUser: CurrentUser): JSX.Element => {
        return currentUser ? (
            <>
                <li><NavLink exact to="/">home</NavLink></li>
                <li><NavLink exact to="/todos">todos</NavLink></li>
                <li onClick={ this.logoutUser }>
                    <button>log out</button>
                </li>
            </>
        ) : (
            <>
                <li><NavLink to="/login">log in</NavLink></li>
                <li><NavLink to="/register">register</NavLink></li>
            </>
        );
    };

    public render(): ReactNode {
        const { open } = this.state;

        return (
            <nav className={ `main-nav ${ open ? 'open' : '' }` } ref={ this.navRef }>
                <div className="container">
                    <div className="logo">
                        <Link to="/"><img src={ logo } alt="logo" /></Link>
                    </div>

                    <button
                        className={ `toggle-nav-btn navbar-switcher ${ !open ? 'collapsed' : '' }` }
                        aria-expanded={ open }
                        aria-label="Toggle navigation"
                        onClick={ (): void => this.setState({ open: !open }) }>
                        <span className="menu_toggle">
                            <span className="hamburger">{ Array.from({ length: 3 }, (_null, idx): JSX.Element => <span key={ idx } />) }</span>
                            <span className="hamburger-cross">{ Array.from({ length: 2 }, (_null, idx): JSX.Element => <span key={ idx } />) }</span>
                        </span>
                    </button>

                    <ul className="links-container">{ this.renderLogging(this.props.currentUser) }</ul>
                </div>
            </nav>
        );
    }
}

export default withRouter(NavBar);
