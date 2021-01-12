import React, { Component } from "react";

import todosService from "../../services/todosService";
import AppContext from "../../contexts/appContext";

import TodoForm from "./TodoForm";
import TodosList from "../reusableComponents/TodosList";
import SectionHeading from "../reusableComponents/SectionHeading";
import UserProfile from "../reusableComponents/UserProfile";

class Home extends Component {
    static contextType = AppContext;

    state = { loading: true };

    async componentDidMount() {
        this.context.updateAppContext({ todos: await todosService.getTodos() });

        this.setState({ loading: false });
    }

    render() {
        const { loading } = this.state;
        const { todos, filterDescription, updateAppContext } = this.context;

        const filteredTodos = todos.filter(({ task }) => task?.toLowerCase()?.includes(filterDescription?.toLowerCase()));

        return (
            <div className="home">
                <section className="todos-app container">
                    <UserProfile />

                    <TodoForm />

                    <div className="todos section">
                        <SectionHeading title="to-do list">
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
