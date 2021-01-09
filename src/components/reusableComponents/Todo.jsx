import React, { Component } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";

import AppContext from "../../contexts/appContext";
import todosService from "../../services/todosService";

class Todo extends Component {
    static contextType = AppContext;

    state = { activeTask: this.props.todo.task, activeDate: this.props.todo.date, editing: false };

    //> >> HANDLE CHANGES:
    onEditTodoChange = ({ currentTarget: { value } }) => this.setState({ activeTask: value });

    onCompleteTodoChange = ({ currentTarget: { checked } }, updateTodo) => {
        this.context.updateAppContext({
            todos: this.context.todos.map(todo => (todo.id === updateTodo.id ? { ...todo, completed: checked } : todo)),
        });

        todosService.updateTodo({ ...updateTodo, completed: checked });
    };

    //> >> ACTIONS:
    onEditTodoMode = () => this.setState({ editing: true });

    onDeleteTodo = todoId => {
        this.context.updateAppContext({ todos: this.context.todos.filter(({ id }) => id !== todoId) });

        todosService.deleteTodo(todoId);
    };

    onConfirmEditTodo = updateTodo => {
        if (!this.state.activeTask?.trim()) return;

        const newTodo = { ...updateTodo, task: this.state.activeTask, date: this.state.activeDate };

        this.context.updateAppContext({
            todos: this.context.todos.map(todo => (todo.id === newTodo.id ? newTodo : todo)),
        });

        todosService.updateTodo(newTodo);

        this.setState({ editing: false });
    };

    onCancelEditTodo = () =>
        this.setState({ editing: false, activeTask: this.props.todo.task, activeDate: this.props.todo.date });

    render() {
        const { activeTask, activeDate, editing } = this.state;
        const { todo } = this.props;

        return (
            <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
                <span className="todo-create-date">{moment(todo.timestamp).fromNow()}</span>

                {!todo.completed && editing ? (
                    <>
                        <div className="inputs-container">
                            <div className="field">
                                <input
                                    type="text"
                                    name={todo.id}
                                    value={activeTask}
                                    onChange={e => this.onEditTodoChange(e)}
                                />
                            </div>

                            <DatePicker
                                selected={activeDate}
                                showTimeSelect
                                onChange={(date, e) => this.setState({ activeDate: date.getTime() })}
                            />
                        </div>

                        <div className="actions">
                            <button className="confirm-todo--btn" onClick={() => this.onConfirmEditTodo(todo)}>
                                <i className="fas fa-download"></i>
                            </button>

                            <button className="cancel-todo--btn" onClick={this.onCancelEditTodo}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="custom-radio">
                            <input
                                type="checkbox"
                                name={todo.id}
                                id={todo.id}
                                value={todo.completed}
                                checked={todo.completed}
                                onChange={e => this.onCompleteTodoChange(e, todo)}
                            />
                            <label htmlFor={todo.id}>
                                <span>
                                    <img
                                        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg"
                                        alt="Checked Icon"
                                    />
                                </span>
                            </label>
                        </div>
                        <div className="todo-task">
                            <p>{todo.task}</p>

                            <span className="todo-estimate--date">
                                {moment(todo.date).format("MMMM Do YYYY, h:mm:ss a")}
                            </span>
                        </div>

                        <div className="actions">
                            {!todo.completed && (
                                <button className="edit-todo--btn" onClick={this.onEditTodoMode}>
                                    <i className="fas fa-pen"></i>
                                </button>
                            )}

                            <button className="delete-todo--btn" onClick={() => this.onDeleteTodo(todo.id)}>
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </>
                )}
            </li>
        );
    }
}

export default Todo;
