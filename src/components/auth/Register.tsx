import React, { ReactNode } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Swal from 'sweetalert2';
import Form from '../reusableComponents/Form';
import { AppContext } from '../../contexts/AppContext';
import { userServices } from '../../services/UserServices';
import { fieldsFactory, objectUtils } from '../../utils';
import { IGeneratedFieldProps, ILoginRegister } from 'types';

interface IRegisterProps extends RouteComponentProps {}

interface IRegisterState {
    data: { username: IGeneratedFieldProps<string>; email: IGeneratedFieldProps<string>; password: IGeneratedFieldProps<string>; 'password confirmation': IGeneratedFieldProps<string>; };
    errors: { username: string; email: string; password: string; 'password confirmation': string; };
    loading: boolean;
}

class Register extends Form<IRegisterProps, IRegisterState> {
    public static contextType = AppContext;

    context!: React.ContextType<typeof AppContext>;

    public readonly state: Readonly<IRegisterState> = {
        data: {
            username: fieldsFactory({
                name: 'username',
                min: 3,
                max: 30,
                autoComplete: 'on',
                placeholder: 'username',
                icon: 'fas fa-user',
            }),

            email: fieldsFactory({
                name: 'email',
                type: 'email',
                autoComplete: 'on',
                placeholder: 'email address',
                icon: 'fas fa-envelope',
            }),

            password: fieldsFactory({
                name: 'password',
                type: 'password',
                placeholder: 'password',
                min: 6,
                max: 30,
                icon: 'fas fa-lock',
            }),

            'password confirmation': fieldsFactory({
                name: 'password confirmation',
                type: 'password',
                placeholder: 'password confirmation',
                icon: 'fas fa-redo-alt',
            }),
        },

        errors: { username: '', email: '', password: '', 'password confirmation': '' },

        loading: false,
    };

    public render(): ReactNode {
        const { errors, loading, data } = this.state;

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
                                { this.renderField(data.username, errors.username) }

                                { this.renderField(data.email, errors.email) }

                                { this.renderField(data.password, errors.password) }

                                { this.renderField(data['password confirmation'], errors['password confirmation']) }

                                <button className="submit-btn" type="submit">{ loading ? <i className="fas fa-spinner fa-pulse fa-lg" /> : 'register' }</button>
                            </form>
                        </div>

                        <div className="login-link-wrapper">already a user? <Link to="/login">login</Link></div>
                    </div>
                </div>
            </div>
        );
    }

    protected onFormSubmit = async (formValues: ILoginRegister): Promise<void> => {
        this.setState({ loading: true });

        const data = objectUtils.pick(formValues, 'username', 'email', 'password');

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
