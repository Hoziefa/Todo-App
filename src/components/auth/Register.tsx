import React, { ReactNode } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Swal from 'sweetalert2';
import Form from '../reusableComponents/Form';
import { AppContext } from '../../contexts/AppContext';
import { inputGenerator } from '../../utils/misc';
import { userServices } from '../../services/UserServices';
import { IGeneratedInput, ILoginRegister } from 'types';

interface IRegisterProps extends RouteComponentProps {}

interface IRegisterState {
    data: { username: IGeneratedInput<string>; email: IGeneratedInput<string>; password: IGeneratedInput<string>; 'password confirmation': IGeneratedInput<string>; };
    errors: { username?: string; email?: string; password?: string; 'password confirmation'?: string; };
    loading: boolean;
}

class Register extends Form<IRegisterProps, IRegisterState> {
    public static contextType = AppContext;

    context!: React.ContextType<typeof AppContext>;

    public readonly state: Readonly<IRegisterState> = {
        data: {
            username: inputGenerator({
                name: 'username',
                min: 3,
                max: 30,
                autoComplete: 'on',
                placeholder: 'username',
                icon: 'fas fa-user',
            }),

            email: inputGenerator({
                name: 'email',
                type: 'email',
                autoComplete: 'on',
                placeholder: 'email address',
                icon: 'fas fa-envelope',
            }),

            password: inputGenerator({
                name: 'password',
                type: 'password',
                placeholder: 'password',
                min: 6,
                max: 30,
                icon: 'fas fa-lock',
            }),

            'password confirmation': inputGenerator({
                name: 'password confirmation',
                type: 'password',
                placeholder: 'password confirmation',
                icon: 'fas fa-redo-alt',
            }),
        },

        errors: {},

        loading: false,
    };

    public render(): ReactNode {
        return (
            <div className="register-form">
                <div className="form-container">
                    <div className="form-title">
                        <i className="fas fa-puzzle-piece" />
                        <h2>Register for to.<span>do</span></h2>
                    </div>

                    <div className="form-wrapper">
                        <div className="form">
                            <form onSubmit={ this.onsubmit }>
                                { this.renderInput(this.state.data.username, this.state.errors.username!) }

                                { this.renderInput(this.state.data.email, this.state.errors.email!) }

                                { this.renderInput(this.state.data.password, this.state.errors.password!) }

                                { this.renderInput(this.state.data['password confirmation'], this.state.errors['password confirmation']!) }

                                <button className="submit-btn" type="submit">
                                    { this.state.loading ? <i className="fas fa-spinner fa-pulse fa-lg" /> : 'register' }
                                </button>
                            </form>
                        </div>

                        <div className="login-link-wrapper">
                            already a user? <Link to="/login">login</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    protected onFormSubmit = async (formValues: ILoginRegister): Promise<void> => {
        this.setState({ loading: true });

        const data = Object.entries(formValues).reduce(
            (acc: ILoginRegister, [key, value]): ILoginRegister => key !== 'password confirmation' ? { ...acc, [key]: value } : acc, {} as ILoginRegister,
        );

        const currentUser = await userServices.auth.registerUser(data);

        if (currentUser.success) {
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

            toast.fire({ icon: 'success', title: `Welcome to our To.Do app ${ currentUser.user!.displayName } enjoy` }).then();

            this.context.updateAppContext({ currentUserProfile: await userServices.profile.getCurrentUserProfile() });
        }
        else {
            Swal.fire({ title: 'Error!', text: currentUser.message, icon: 'error', confirmButtonText: 'Okay' }).then();

            this.setState({ loading: false });
        }
    };
}

export default Register;
