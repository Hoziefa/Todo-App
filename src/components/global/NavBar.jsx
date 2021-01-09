import React, { Component } from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import userService from "../../services/userService";

import logo from "../../assets/logo.png";

class NavBar extends Component {
    state = { open: false };

    navRef = React.createRef();

    componentDidMount() {
        let { height: navHeight } = this.navRef.current.getBoundingClientRect();

        document.documentElement.style.setProperty("--nav-height", `${navHeight}px`);
    }

    logoutUser = async () => {
        await userService.logoutUser();

        this.props.history.push("/");
    };

    renderLogging = currentUser =>
        currentUser ? (
            <li onClick={this.logoutUser}>
                <button>log out</button>
            </li>
        ) : (
            <li>
                <NavLink to="/login">log in</NavLink>
            </li>
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

                    <ul className="links-container">
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

                        {this.renderLogging(this.props.currentUser)}
                    </ul>
                </div>
            </nav>
        );
    }
}

export default withRouter(NavBar);
