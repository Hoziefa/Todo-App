import React, { ChangeEvent, ReactNode } from 'react';
import Swal from 'sweetalert2';
import Cropper from 'react-easy-crop';
import { fieldsFactory, getCroppedImg } from '../../utils';
import { userServices } from '../../services';
import { AppContext } from '../../contexts/AppContext';
import Form from '../reusableComponents/Form';
import Modal from '../reusableComponents/Modal';
import { AcceptedFileUploadTypes, FieldTypes, IGeneratedFieldProps, InputTypes, ValidationErrorStyle } from 'types';
import { Area } from 'react-easy-crop/types';
import uploadingImage from '../../assets/uploading.gif';

interface IUpdateUserProfileFormProps {
    modal: boolean;
    closeModal(): void;
}

interface IUpdateUserProfileFormState {
    data: { username: IGeneratedFieldProps<string>; avatar: IGeneratedFieldProps<string> };
    errors: { username: string; avatar: string };
    uploading: boolean;
    image: string;
    crop: { x: number; y: number };
    zoom: number;
    aspect: number;
    croppedImage: Area | null | string;
    croppedAreaPixels: Area | null;
    blob: Blob | null;
    uploadSuccess: boolean;
}

class UpdateUserProfileForm extends Form<IUpdateUserProfileFormProps, IUpdateUserProfileFormState> {
    public static contextType = AppContext;

    context!: React.ContextType<typeof AppContext>;

    public readonly state: Readonly<IUpdateUserProfileFormState> = {
        data: {
            username: fieldsFactory({
                name: 'username',
                min: 3,
                max: 30,
                placeholder: 'username',
                validationErrorStyle: ValidationErrorStyle.ValidationErrorUnderline,
                icon: 'fas fa-user',
                value: this.context?.currentUserProfile?.username,
            }),

            avatar: fieldsFactory({
                name: 'avatar',
                type: InputTypes.File,
                element: FieldTypes.File,
                validationErrorStyle: ValidationErrorStyle.ValidationErrorUnderline,
                noValidate: true,
                avatar: this.context?.currentUserProfile?.avatar,
                accept: AcceptedFileUploadTypes.ImageList,
                onFileUploadChange: (e): void => this.onFileUploadChange(e),
            }),
        },

        errors: { username: '', avatar: '' },
        uploading: false,
        image: '',
        crop: { x: 0, y: 0 },
        zoom: 1,
        aspect: 4 / 3,
        croppedImage: null,
        croppedAreaPixels: null,
        blob: null,
        uploadSuccess: false,
    };

    public render(): ReactNode {
        const { data, errors, image, uploading } = this.state;

        return (
            <Modal active={ this.props.modal } onClose={ (): false | void => !uploading && this.closeModal() } className="update-user-profile--modal">
                <div className="form-container">
                    <div className="form-wrapper">
                        <div className="title"><h2>update profile</h2></div>

                        <form onSubmit={ this.onsubmit } className="form">
                            { uploading
                                ? <div className="dimmer-loader"><img src={ uploadingImage } alt="uploading" width="434" height="326" /></div>
                                : <>
                                    { this.renderField(data.avatar, errors.avatar) }

                                    { data.avatar.value && image && (
                                        <div className="cropper">
                                            <Cropper
                                                image={ this.state.image }
                                                crop={ this.state.crop }
                                                zoom={ this.state.zoom }
                                                aspect={ this.state.aspect }
                                                onCropChange={ (crop): void => this.setState({ crop }) }
                                                onCropComplete={ this.onCropComplete }
                                                onZoomChange={ (zoom): void => this.setState({ zoom }) }
                                            />
                                        </div>
                                    ) }
                                </>
                            }

                            { this.renderField(data.username, errors.username) }

                            <div className="actions">
                                <button type="submit" className="submit-btn" disabled={ this.shouldSubmitBtnBeDisabled() }>
                                    update <i className="fas fa-plus" />
                                </button>

                                <button type="button" className="cancel-btn" onClick={ this.closeModal } disabled={ uploading }>
                                    cancel <i className="fas fa-times" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        );
    }

    public componentDidUpdate(prevProps: IUpdateUserProfileFormProps, prevState: IUpdateUserProfileFormState): void {
        const { currentUserProfile } = this.context;
        const { data } = this.state;

        if (!data.username.value && currentUserProfile?.username) {
            this.setState({ data: { ...data, username: { ...data.username, value: currentUserProfile?.username }, avatar: { ...data.avatar, avatar: currentUserProfile?.avatar } } });
        }
    }

    protected onFormSubmit = async ({ username }: { username: string | null }): Promise<void> => {
        const { updateAppContext, currentUserProfile } = this.context;

        if (username && this.state.uploadSuccess) {
            await userServices.profile.changeCurrentUserProfile(username);

            const newAvatar = await this.onUploadFile();

            updateAppContext({ currentUserProfile: { ...this.context.currentUserProfile, avatar: newAvatar!, username } });

            this.closeModal();

            this.displaySuccessAlert();
        }
        else if (username && !this.state.image && username !== currentUserProfile?.username) {
            await userServices.profile.changeCurrentUserProfile(username);

            updateAppContext({ currentUserProfile: { ...this.context.currentUserProfile!, username } });

            this.closeModal();

            this.displaySuccessAlert();
        }
        else if (this.state.uploadSuccess) {
            const newAvatar = await this.onUploadFile();

            updateAppContext({ currentUserProfile: { ...this.context.currentUserProfile!, avatar: newAvatar! } });

            this.closeModal();

            this.displaySuccessAlert();
        }
    };

    private closeModal = (): void => {
        this.setState({
            data: {
                ...this.state.data,
                username: this.resetField('username', this.context.currentUserProfile?.username!),
                avatar: { ...this.resetField('avatar'), avatar: this.context.currentUserProfile?.avatar },
            },
            errors: this.clearErrors(),
            uploading: false,
            image: '',
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: 4 / 3,
            croppedImage: null,
            croppedAreaPixels: null,
            blob: null,
            uploadSuccess: false,
        });

        this.props.closeModal();
    };

    private displaySuccessAlert(): void {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast): void => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
        });

        toast.fire({ icon: 'success', title: 'Updated Successfully' }).then();
    }

    //#region Change user avatar and name
    private onFileUploadChange = ({ target: { files } }: ChangeEvent<HTMLInputElement>): void => {
        const reader = new FileReader();

        files?.item(0) && reader.readAsDataURL(files.item(0)!);

        reader.addEventListener('load', (): void => this.setState({ image: reader.result as string, uploadSuccess: true }), false);
    };

    private onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area): void => this.setState({ croppedAreaPixels });

    private handleCroppedImage = async (): Promise<void> => {
        const { image, croppedAreaPixels } = this.state;

        try {
            const { croppedImage, blob } = await getCroppedImg(image, croppedAreaPixels!);

            this.setState({ croppedImage, blob, uploadSuccess: true });
        }
        catch (e) {
            console.error(e);

            this.setState({ uploadSuccess: false });
        }
    };

    private onUploadFile = async (): Promise<string | null> => {
        await this.handleCroppedImage();

        const { blob } = this.state;

        if (!blob) return null;

        this.setState({ uploading: true });

        return await userServices.profile.changeCurrentUserAvatar({ blob, metadata: { contentType: blob.type } }, `avatars/user/${ userServices.auth.currentUser?.uid }`);
    };

    //#endregion Change user avatar and name

    private shouldSubmitBtnBeDisabled(): boolean {
        const { errors, data, image, uploading } = this.state;
        const { currentUserProfile } = this.context;

        return uploading || !!errors.username || (data.username.value === currentUserProfile?.username && !image);
    }
}

export default UpdateUserProfileForm;
