import React from "react";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";

import AppContext from "../../contexts/appContext";

import todosService from "../../services/todosService";
import { inputGenerator } from "../../utils/misc";

import Form from "../reusableComponents/Form";
import Modal from "../reusableComponents/Modal";

class TodoForm extends Form {
    static contextType = AppContext;

    state = {
        data: {
            task: inputGenerator({
                name: "task",
                min: 3,
                label: "what do you want to do?",
                validationlabel: "new to-do",
                validationErrorClass: "validation-error--underline",
                autoComplete: "off",
            }),
        },
        errors: {},

        date: 0,
    };

    closeModal = () => {
        this.context.updateAppContext({ modal: false });

        this.setState({
            data: { ...this.state.data, task: { ...this.state.data.task, value: "", active: false } },
            errors: { ...this.state.errors, task: "" },
            date: 0,
        });
    };

    createNewTask = async (task, date) => {
        const todo = { task, date, timestamp: todosService.getTimestamp, completed: false };

        const newTodo = await todosService.createTodo(todo);

        this.context.updateAppContext({ todos: [...this.context.todos, newTodo], modal: false });

        this.setState({
            data: { ...this.state.data, task: { ...this.state.data.task, value: "", active: false } },
            date: 0,
        });
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
                        date: 0,
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
                <Modal active={this.context.modal} onClose={this.closeModal} className="add-todo--modal">
                    <div className="form-container">
                        <div className="form-wrapper">
                            <div className="title">
                                <h2>create new to-do</h2>
                            </div>

                            <form onSubmit={this.onsubmit} className="form">
                                <div className="inputs-container">
                                    {this.renderInput(data.task, errors.task)}

                                    <div className="date--picker">
                                        <DatePicker
                                            selected={date}
                                            dateFormat="Pp"
                                            showTimeSelect
                                            onChange={(date, e) => this.setState({ date: date.getTime() })}
                                        />

                                        <i className="far fa-calendar-alt"></i>
                                    </div>
                                </div>

                                <div className="actions">
                                    <button
                                        type="submit"
                                        className="submit-btn"
                                        disabled={errors.task || !data.task.value || !date}>
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
