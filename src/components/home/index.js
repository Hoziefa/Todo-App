import React, { Component } from "react";

import todosService from "../../services/todosService";
import AppContext from "../../contexts/appContext";

import TodoForm from "./TodoForm";
import TodosList from "../reusableComponents/TodosList";
import SectionHeading from "../reusableComponents/SectionHeading";

class Home extends Component {
    static contextType = AppContext;

    state = { loading: true };

    async componentDidMount() {
        this.context.updateAppContext({ todos: await todosService.getTodos() });

        this.setState({ loading: false });
    }

    render() {
        const { loading } = this.state;
        const { todos, filterDescription, updateAppContext, currentUser } = this.context;

        const filteredTodos = todos.filter(({ task }) => task?.toLowerCase()?.includes(filterDescription?.toLowerCase()));

        let icon = (
            <svg
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
                role="presentation"
                style={{ width: "42px", height: "38px" }}>
                <path fill="none" d="M0 0h24v24H0V0z" opacity=".87"></path>
                <g>
                    <path d="M3 14h4v-4H3v4zm0 5h4v-4H3v4zM3 9h4V5H3v4zm5 5h12v-4H8v4zm0 5h12v-4H8v4zM8 5v4h12V5H8z"></path>
                </g>
            </svg>
        );

        return (
            <div className="home">
                <section className="todos-app container">
                    <div className="user-welcome">
                        <h2>Hey {currentUser?.displayName},</h2>
                        <p>Are you ready to complete your tasks?</p>
                    </div>

                    <TodoForm />

                    <div className="todos section">
                        <SectionHeading icon={icon} title="to-do list">
                            <div className="field">
                                <input
                                    type="text"
                                    name="filterDescription"
                                    placeholder="search to-do ..."
                                    value={filterDescription}
                                    onChange={({ currentTarget: { value } }) => {
                                        this.context.updateAppContext({ filterDescription: value });

                                        window.localStorage.setItem("filterDescription", value);
                                    }}
                                />
                                <i className="fas fa-search"></i>
                            </div>

                            <button
                                className="add-todo-btn"
                                onClick={() => {
                                    updateAppContext({ modal: true, filterDescription: "" });

                                    window.localStorage.removeItem("filterDescription");
                                }}>
                                <i className="fas fa-plus"></i>
                            </button>
                        </SectionHeading>

                        {loading ? (
                            <div className="loader">
                                <i className="fas fa-spinner fa-pulse fa-2x"></i>
                            </div>
                        ) : (
                            <>
                                {filteredTodos.length ? (
                                    <TodosList todos={filteredTodos} />
                                ) : (
                                    <h5 className="message">no active to-do found!</h5>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        );
    }
}

export default Home;
