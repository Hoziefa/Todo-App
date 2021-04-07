import React, { Component, ReactNode } from 'react';

import { AppContext } from '../../contexts/AppContext';
import { userServices } from '../../services/UserServices';

import UpdateUserProfileForm from './UpdateUserProfileForm';

import placeholderImage from '../../assets/placeholder-image.jpg';

interface IUserProfileProps {}

interface IUserProfileState {
    modal: boolean;
}

class UserProfile extends Component<IUserProfileProps, IUserProfileState> {
    public static contextType = AppContext;

    context!: React.ContextType<typeof AppContext>;

    public readonly state: Readonly<IUserProfileState> = { modal: false };

    public render(): ReactNode {
        const { currentUserProfile } = this.context;

        return (
            <>
                <div className="user-profile">
                    <div className="user-info">
                        <h2>Hey { currentUserProfile?.username },</h2>
                        <p>Are you ready to complete your tasks?</p>
                    </div>

                    <div className="user-avatar" onClick={ (): void => this.toggleModal(true) }>
                        <img src={ currentUserProfile?.avatar ?? placeholderImage } alt="avatar" />
                    </div>
                </div>

                <UpdateUserProfileForm modal={ this.state.modal } closeModal={ (): void => this.toggleModal(false) } />
            </>
        );
    }

    public async componentDidMount(): Promise<void> {
        this.context.updateAppContext({ currentUserProfile: await userServices.profile.getCurrentUserProfile() });
    }

    private toggleModal = (isOpen: boolean): void => this.setState({ modal: isOpen });
}

export default UserProfile;
