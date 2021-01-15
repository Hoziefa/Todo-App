import React, { Component } from "react";
import { NavLink, Link, withRouter } from "react-router-dom";

import AppContext from "../../contexts/appContext";

import userService from "../../services/userService";

import logo from "../../assets/logo.png";

class NavBar extends Component {
    static contextType = AppContext;

    state = { open: false };

    navRef = React.createRef();

    componentDidMount() {
        let { height: navHeight } = this.navRef.current.getBoundingClientRect();

        document.documentElement.style.setProperty("--nav-height", `${navHeight}px`);
    }

    logoutUser = async () => {
        await userService.logoutUser();

        this.setState({ open: false });

        this.props.history.push("/");

        this.context.updateAppContext({ currentUser: null, currentUserProfile: null });
    };

    renderLogging = currentUser =>
        currentUser ? (
            <>
                <li>
                    <NavLink exact to="/">
                        home
                    </NavLink>
                </li>

                <li>
                    <NavLink exact to="/todos">
                        todos
                    </NavLink>
                </li>

                <li onClick={this.logoutUser}>
                    <button>log out</button>
                </li>
            </>
        ) : (
            <>
                <li>
                    <NavLink to="/login">log in</NavLink>
                </li>

                <li>
                    <NavLink to="/register">register</NavLink>
                </li>
            </>
        );

    render() {
        const { open } = this.state;

        return (
            <nav className={`main-nav ${open ? "open" : ""}`} ref={this.navRef}>
                <div className="container">
                    <div className="logo">
                        <Link to="/">
                            <img src={logo} alt="logo" width="60" height="60" />
                        </Link>
                    </div>

                    <button
                        className={`toggle-nav-btn navbar-toggler ${!open ? "collapsed" : ""}`}
                        aria-expanded={open}
                        aria-label="Toggle navigation"
                        onClick={() => this.setState({ open: !open })}>
                        <span className="menu_toggle">
                            <span className="hamburger">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                            <span className="hamburger-cross">
                                <span></span>
                                <span></span>
                            </span>
                        </span>
                    </button>

                    <ul className="links-container">{this.renderLogging(this.props.currentUser)}</ul>
                </div>
            </nav>
        );
    }
}

export default withRouter(NavBar);
