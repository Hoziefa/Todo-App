import { ReactNode } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import Swal from 'sweetalert2';

import { inputGenerator } from '../../utils/misc';

import { userServices } from '../../services/UserServices';

import Form from '../reusableComponents/Form';
import { AppContext } from '../../contexts/appContext';
import { IGeneratedInput, ILoginRegister, IObjectHasComputedProps } from 'types';

interface IRegisterProps extends RouteComponentProps {}

interface IRegisterState {
    data: {
        username: IGeneratedInput<string>;
        email: IGeneratedInput<string>;
        password: IGeneratedInput<string>;
        'password confirmation': IGeneratedInput<string>;
    };
    errors: {
        username?: string;
        email?: string;
        password?: string;
        'password confirmation'?: string;
    };
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

    protected onFormSubmit = async (formValues: ILoginRegister) => {
        this.setState({ loading: true });

        const data = Object.entries(formValues).reduce(
            (acc: IObjectHasComputedProps, [key, value]) =>
                key !== 'password confirmation' ? { ...acc, [key]: value } : acc,
            {},
        );

        const currentUser = await userServices.auth.registerUser(data as ILoginRegister);

        if (currentUser.success) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: toast => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
            });

            Toast.fire({
                icon: 'success',
                title: `Welcome to our To.Do app ${currentUser.user!.displayName} enjoy`,
            });

            this.context.updateAppContext({ currentUserProfile: await userServices.profile.getCurrentUserProfile() });
        } else {
            Swal.fire({ title: 'Error!', text: currentUser.message, icon: 'error', confirmButtonText: 'Okay' });

            this.setState({ loading: false });
        }
    };

    public render(): ReactNode {
        return (
            <div className="register-form">
                <div className="form-container">
                    <div className="form-title">
                        <i className="fas fa-puzzle-piece"></i>
                        <h2>
                            Register for to.<span>do</span>
                        </h2>
                    </div>

                    <div className="form-wrapper">
                        <div className="form">
                            <form onSubmit={this.onsubmit}>
                                {this.renderInput(this.state.data.username, this.state.errors.username!)}

                                {this.renderInput(this.state.data.email, this.state.errors.email!)}

                                {this.renderInput(this.state.data.password, this.state.errors.password!)}

                                {this.renderInput(
                                    this.state.data['password confirmation'],
                                    this.state.errors['password confirmation']!,
                                )}

                                <button className="submit-btn" type="submit">
                                    {this.state.loading ? <i className="fas fa-spinner fa-pulse fa-lg"></i> : 'register'}
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
}

export default Register;