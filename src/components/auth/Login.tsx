import { Link, RouteComponentProps } from 'react-router-dom';

import Swal from 'sweetalert2';

import { inputGenerator } from '../../utils/misc';

import { userServices } from '../../services/UserServices';

import Form from '../reusableComponents/Form';
import { IGeneratedInput, ILoginRegister } from 'types';
import { ReactNode } from 'react';

interface ILoginProps extends RouteComponentProps {}

interface ILoginState {
    data: { email: IGeneratedInput<string>; password: IGeneratedInput<string> };
    errors: { email?: string; password?: string };
    loading: boolean;
}

class Login extends Form<ILoginProps, ILoginState> {
    public readonly state: Readonly<ILoginState> = {
        data: {
            email: inputGenerator({
                name: 'email',
                type: 'email',
                autoComplete: 'on',
                placeholder: 'enter your email',
                icon: 'fas fa-envelope',
            }),

            password: inputGenerator({
                name: 'password',
                type: 'password',
                min: 6,
                max: 30,
                placeholder: 'enter your password',
                icon: 'fas fa-lock',
            }),
        },

        errors: {},

        loading: false,
    };

    public render(): ReactNode {
        return (
            <div className="login-form">
                <div className="form-container">
                    <div className="form-title">
                        <i className="fas fa-sign-in-alt" />
                        <h2>
                            log in to to.<span>do</span>
                        </h2>
                    </div>

                    <div className="form-wrapper">
                        <div className="form">
                            <form onSubmit={ this.onsubmit }>
                                { this.renderInput(this.state.data.email, this.state.errors.email!) }

                                { this.renderInput(this.state.data.password, this.state.errors.password!) }

                                <button className="submit-btn" type="submit">
                                    { this.state.loading ? <i className="fas fa-spinner fa-pulse fa-lg" /> : 'log in' }
                                </button>
                            </form>
                        </div>

                        <div className="register-link-wrapper">
                            don't have an account? <Link to="/register">register</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    protected onFormSubmit = async (formValues: ILoginRegister): Promise<void> => {
        this.setState({ loading: true });

        const currentUser = await userServices.auth.loginUser(formValues);

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

            await toast.fire({ icon: 'success', title: `Welcome back ${ currentUser.user?.displayName }` });
        }
        else {
            Swal.fire({ title: 'Error!', text: currentUser.message, icon: 'error', confirmButtonText: 'Okay' }).then();

            this.setState({ loading: false });
        }
    };
}

export default Login;
