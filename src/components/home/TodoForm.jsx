import React from "react";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";

import AppContext from "../../contexts/appContext";

import todosService from "../../services/todosService";
import { generateInput } from "../../utils/misc";

import Form from "../reusableComponents/Form";
import Modal from "../reusableComponents/Modal";

class TodoForm extends Form {
    static contextType = AppContext;

    state = {
        data: {
            task: generateInput({ name: "task", label: "what do you want to do?", validationlabel: "new to-do", min: 3 }),
        },
        errors: {},

        date: Date.now(),
    };

    closeModal = () => {
        this.context.updateAppContext({ modal: false });

        this.setState({
            data: { ...this.state.data, task: { ...this.state.data.task, value: "", active: false } },
            errors: { ...this.state.errors, task: "" },
            date: Date.now(),
        });
    };

    createNewTask = async (task, date) => {
        const todo = { task, date, timestamp: todosService.getTimestamp, completed: false };

        const newTodo = await todosService.createTodo(todo);

        this.context.updateAppContext({ todos: [...this.context.todos, newTodo], modal: false });

        this.setState({ data: { ...this.state.data, task: { ...this.state.data.task, value: "", active: false } } });
    };

    onFormSubmit = ({ task }) => {
        if (!this.state.date) return;

        if (this.context.todos.some(({ task: todoTask }) => todoTask === task)) {
            Swal.fire({
                title: "You already have to-do with this value. Do you want to save it anyway?",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: `Save`,
                denyButtonText: `Don't save`,
            }).then(result => {
                if (result.isConfirmed) {
                    Swal.fire("Saved!", "", "success");

                    this.createNewTask(task, this.state.date);
                } else if (result.isDenied) {
                    Swal.fire("To-do not saved", "", "info");

                    this.setState({
                        data: { ...this.state.data, task: { ...this.state.data.task, value: "", active: false } },
                    });
                }
            });
        } else {
            this.createNewTask(task, this.state.date);
        }
    };

    render() {
        const { data, errors, date } = this.state;

        return (
            <div className="add-todo--form">
                <Modal active={this.context.modal} onClose={this.closeModal}>
                    <div className="form-container">
                        <div className="form-wrapper">
                            <div className="title">
                                <h2>create new to-do</h2>
                            </div>

                            <form onSubmit={this.onsubmit} className=".form">
                                <div className="inputs-container">
                                    {this.renderInput(data.task, errors.task)}

                                    <DatePicker
                                        selected={date}
                                        dateFormat="Pp"
                                        showTimeSelect
                                        onChange={(date, e) => this.setState({ date: date.getTime() })}
                                    />
                                </div>

                                <div className="actions">
                                    <button
                                        type="submit"
                                        className="submit-btn"
                                        disabled={!data.task.value.trim() || !date}>
                                        create <i className="fas fa-plus"></i>
                                    </button>

                                    <button className="cancel-btn" type="button" onClick={this.closeModal}>
                                        cancel <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default TodoForm;
