import React from "react";

import AppContext from "../../contexts/appContext";

import todosService from "../../services/todosService";
import { generateInput } from "../../utils/misc";

import Form from "../reusableComponents/Form";

class TodoForm extends Form {
    static contextType = AppContext;

    state = {
        data: { content: generateInput({ name: "content", label: "what do you want to do?", noValidate: true }) },
        errors: {},
    };

    onFormSubmit = async ({ content }) => {
        const todo = { content, timestamp: todosService.getTimestamp, done: false, editing: false };

        await todosService.createTodo(todo);

        this.context.updateAppContext({ key: "todos", value: [this.context.todos, todo] });

        this.setState({ data: { ...this.state.data, content: { ...this.state.data.content, value: "" } } });
    };

    render() {
        return (
            <div className="add-todo--form">
                <div className="section-heading">
                    <div className="section-icon">
                        <svg
                            focusable="false"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            role="presentation"
                            style={{ width: "42px", height: "38px" }}>
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path>
                        </svg>
                    </div>
                    <h5 className="section-title">add item</h5>
                </div>

                <div className="section-content">
                    <form onSubmit={this.onsubmit}>
                        {this.renderInput(this.state.data.content, this.state.errors.content)}

                        <button type="submit" className="submit-btn" disabled={!this.state.data.content.value.trim()}>
                            <i className="fas fa-plus"></i>
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default TodoForm;
