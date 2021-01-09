import React from "react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";

import { generateInput } from "../../utils/misc";

import userService from "../../services/userService";

import Form from "../reusableComponents/Form";

class Login extends Form {
    state = {
        data: {
            email: generateInput({
                name: "email",
                type: "email",
                autoComplete: "on",
                placeholder: "enter your email",
                icon: "fas fa-envelope",
            }),

            password: generateInput({
                name: "password",
                type: "password",
                min: 6,
                max: 30,
                placeholder: "enter your password",
                icon: "fas fa-lock",
            }),
        },

        errors: {},

        loading: false,
    };

    onFormSubmit = async formValues => {
        this.setState({ loading: true });

        const currentUser = await userService.loginUser(formValues);

        if (currentUser.error)
            Swal.fire({ title: "Error!", text: currentUser.error, icon: "error", confirmButtonText: "Okay" });
        else {
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
                title: "Signed in successfully",
            });
        }
    };

    render() {
        return (
            <div className="login-form">
                <div className="form-container">
                    <div className="form-title">
                        <i className="fas fa-code-branch"></i>
                        <h2>log in to to-dos</h2>
                    </div>

                    <div className="form-wrapper">
                        <div className="form">
                            <form onSubmit={this.onsubmit}>
                                {this.renderInput(this.state.data.email, this.state.errors.email)}

                                {this.renderInput(this.state.data.password, this.state.errors.password)}

                                <button className="submit-btn" type="submit">
                                    {this.state.loading ? <i class="fas fa-spinner fa-pulse fa-lg"></i> : "log in"}
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
}

export default Login;
