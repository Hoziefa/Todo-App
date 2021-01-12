import React, { Component } from "react";

import AppContext from "../../contexts/appContext";
import userService from "../../services/userService";

import UpdateUserProfileForm from "./UpdateUserProfileForm";

import placeholderImage from "../../assets/placeholder-image.jpg";

class UserProfile extends Component {
    static contextType = AppContext;

    state = { modal: false };

    async componentDidMount() {
        this.context.updateAppContext({ currentUserProfile: await userService.getCurrentUserProfile() });
    }

    displayModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    render() {
        const { currentUserProfile } = this.context;

        return (
            <>
                <div className="user-profile">
                    <div className="user-info">
                        <h2>Hey {currentUserProfile?.username},</h2>
                        <p>Are you ready to complete your tasks?</p>
                    </div>

                    <div className="user-avatar" onClick={this.displayModal}>
                        <img src={currentUserProfile?.avatar || placeholderImage} alt="avatar" />
                    </div>
                </div>

                <UpdateUserProfileForm modal={this.state.modal} closeModal={this.closeModal} />
            </>
        );
    }
}

export default UserProfile;
