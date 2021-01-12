import React, { Component } from "react";

class UserProfile extends Component {
    componentDidMount() {}

    render() {
        return (
            <div className="user-profile">
                <div className="user-info">
                    <h2>Hey {"currentUser?.name"},</h2>
                    <p>Are you ready to complete your tasks?</p>
                </div>

                <div className="user-avatar">
                    <img src={"currentUser?.avatar"} alt="avatar" />
                </div>
            </div>
        );
    }
}

export default UserProfile;
