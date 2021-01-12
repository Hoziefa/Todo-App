import React from "react";
import Swal from "sweetalert2";
import Cropper from "react-easy-crop";

import { inputGenerator } from "../../utils/misc";
import getCroppedImg from "../../utils/cropImage";

import AppContext from "../../contexts/appContext";
import userService from "../../services/userService";

import Form from "../reusableComponents/Form";
import Modal from "../reusableComponents/Modal";

class UpdateUserProfileForm extends Form {
    static contextType = AppContext;

    state = {
        data: {
            username: inputGenerator({
                name: "username",
                min: 3,
                max: 30,
                placeholder: "username",
                validationErrorClass: "validation-error--underline",
                icon: "fas fa-user",
                value: this.context.currentUserProfile?.username,
                initialvalue: this.context.currentUserProfile?.username,
            }),

            avatar: inputGenerator({
                name: "avatar",
                type: "file",
                element: "file",
                label: "new avatar",
                validationErrorClass: "validation-error--underline",
                displayErrorMsg: false,
                onFileUploadChange: e => this.onFileUploadChange(e),
            }),
        },

        errors: {},
        uploading: false,
        image: "",
        crop: { x: 0, y: 0 },
        zoom: 1,
        aspect: 4 / 3,
        croppedImage: null,
        croppedAreaPixels: null,
        blob: null,
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.data.username.initialvalue && !this.state.data.username.initialvalue) {
            this.setState({
                data: {
                    ...this.state.data,
                    username: {
                        ...this.state.data.username,
                        value: this.context.currentUserProfile?.username,
                        initialvalue: this.context.currentUserProfile?.username,
                    },
                },
            });
        }
    }

    closeModal = () => {
        this.setState({
            data: {
                ...this.state.data,
                username: { ...this.state.data.username, value: this.context.currentUserProfile?.username },
                avatar: { ...this.state.data.avatar, value: "" },
            },
            errors: { ...this.state.errors, username: "", avatar: "" },
            uploading: false,
            image: "",
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: 4 / 3,
            croppedImage: null,
            croppedAreaPixels: null,
            blob: null,
        });

        this.props.closeModal();
    };

    //#region Change user avatar and name
    onFileUploadChange = ({ target: { files: [file] } = {} }) => {
        const reader = new FileReader();

        file && reader.readAsDataURL(file);

        reader.addEventListener("load", () => this.setState({ image: reader.result }), false);
    };

    onCropComplete = (croppedArea, croppedAreaPixels) => this.setState({ croppedAreaPixels });

    handleCroppedImage = async () => {
        const { image, croppedAreaPixels } = this.state;

        try {
            const { croppedImage, blob } = await getCroppedImg(image, croppedAreaPixels);

            this.setState({ croppedImage, blob });
        } catch (e) {
            console.error(e);
        }
    };

    onFormSubmit = async ({ username }) => {
        if (!this.state.image || !username) return;

        await this.handleCroppedImage();

        const { currentUser, updateAppContext } = this.context;
        const { blob } = this.state;

        if (!blob) return;

        this.setState({ uploading: true });

        const newAvatar = await userService.changeCurrentUserAvatar(
            { blob, metadata: { contentType: blob.type } },
            `avatars/user/${currentUser?.uid}`,
        );

        updateAppContext({ currentUserProfile: { ...this.context.currentUserProfile, avatar: newAvatar, username } });

        this.closeModal();

        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: toast => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });

        Toast.fire({
            icon: "success",
            title: "Updated Successfully",
        });
    };
    //#endregion Change user avatar and name

    render() {
        const { data, errors, image, uploading } = this.state;

        return (
            <Modal active={this.props.modal} onClose={this.closeModal} className="update-user-profile--modal">
                <div className="form-container">
                    <div className="form-wrapper">
                        <div className="title">
                            <h2>update profile</h2>
                        </div>

                        <form onSubmit={this.onsubmit} className="form">
                            {uploading ? (
                                <div className="dimmer-loader">
                                    <i className="fas fa-spinner fa-pulse fa-lg"></i>
                                </div>
                            ) : (
                                <>
                                    {this.renderInput(data.avatar, errors.avatar)}

                                    {data.avatar.value && image && (
                                        <div className="cropper">
                                            <Cropper
                                                image={this.state.image}
                                                crop={this.state.crop}
                                                zoom={this.state.zoom}
                                                aspect={this.state.aspect}
                                                onCropChange={crop => this.setState({ crop })}
                                                onCropComplete={this.onCropComplete}
                                                onZoomChange={zoom => this.setState({ zoom })}
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {this.renderInput(data.username, errors.username)}

                            <div className="actions">
                                <button type="submit" className="submit-btn" disabled={errors.username || !image}>
                                    update <i className="fas fa-plus"></i>
                                </button>

                                <button
                                    className="cancel-btn"
                                    type="button"
                                    onClick={this.closeModal}
                                    disabled={uploading}>
                                    cancel <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default UpdateUserProfileForm;
