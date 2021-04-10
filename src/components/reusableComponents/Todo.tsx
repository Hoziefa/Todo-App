import React, { ChangeEvent, Component, ReactNode } from 'react';
import DatePicker from 'react-datepicker';
import { AppContext } from '../../contexts/AppContext';
import { todosService } from '../../services/TodosService';
import { dateService } from 'services/DateService';
import { ITodo } from 'types';

interface ITodoProps {
    todo: ITodo;
}

interface ITodoState {
    activeTask: string;
    activeDate: Date;
    editing: boolean;
}

class Todo extends Component<ITodoProps, ITodoState> {
    public static contextType = AppContext;

    context!: React.ContextType<typeof AppContext>;

    public readonly state: Readonly<ITodoState> = {
        activeTask: this.props.todo.task,
        activeDate: dateService.toDate(this.props.todo.date),
        editing: false,
    };

    public render(): ReactNode {
        const { activeTask, activeDate, editing } = this.state;
        const { todo } = this.props;

        return (
            <li className={ `todo-item ${ todo.completed ? 'completed' : '' }` }>
                <span className="todo-created-date">{ dateService.diffFromNow(todo.timestamp) }</span>

                { !todo.completed && editing ? this.renderTodoEditMode(todo, activeTask, activeDate) : this.renderTodoReadMode(todo) }
            </li>
        );
    }

    private renderTodoEditMode(todo: ITodo, activeTask: string, activeDate: Date): JSX.Element {
        return <>
            <div className="inputs-container">
                <div className="field"><input type="text" name={ todo.id } value={ activeTask } onChange={ this.onEditTodoChange } /></div>

                <DatePicker selected={ activeDate } showTimeSelect onChange={ (date: Date): void => this.setState({ activeDate: date }) } />
            </div>

            <div className="actions">
                <button className="confirm-todo--btn" aria-label="confirm" onClick={ (): void => this.onConfirmEditTodo(todo) }>
                    <i className="fas fa-check" />
                </button>

                <button className="cancel-todo--btn" aria-label="cancel" onClick={ this.onCancelEditTodo }>
                    <i className="fas fa-times" />
                </button>
            </div>
        </>;
    }

    private renderTodoReadMode(todo: ITodo): JSX.Element {
        return <>
            <div className="custom-radio">
                <input
                    type="checkbox"
                    name={ todo.id }
                    id={ todo.id }
                    value={ `${ todo.completed }` }
                    checked={ todo.completed }
                    onChange={ (e): void => this.onCompleteTodoChange(e, todo) }
                />
                <label htmlFor={ todo.id }><span><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/check-icn.svg" alt="Checked Icon" /></span></label>
            </div>

            <div className="todo-task">
                <p>{ todo.task }</p>

                <span className="todo-estimate--date">{ dateService.format(todo.date) } - { dateService.diffFromNow(todo.date) }</span>
            </div>

            <div className="actions">
                { !todo.completed && <button className="edit-todo--btn" aria-label="edit" onClick={ this.onEditTodoMode }><i className="fas fa-pen" /></button> }

                <button className="delete-todo--btn" aria-label="delete" onClick={ (): void => this.onDeleteTodo(todo.id!) }><i className="fas fa-trash" /></button>
            </div>
        </>;
    }

    //#region Handle changes on task/date fields.
    private onEditTodoChange = ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>): void => this.setState({ activeTask: value });

    private onCompleteTodoChange = ({ currentTarget: { checked } }: ChangeEvent<HTMLInputElement>, updateTodo: ITodo): void => {
        this.context.updateAppContext({ todos: this.context.todos.map((todo): ITodo => (todo.id === updateTodo.id ? { ...todo, completed: checked } : todo)) });

        todosService.updateTodo({ ...updateTodo, completed: checked }).then();
    };

    //#endregion Handle changes on task/date fields.

    //#region ToDo_Actions
    private onEditTodoMode = (): void => this.setState({ editing: true });

    private onDeleteTodo = (todoId: string): void => {
        this.context.updateAppContext({ todos: this.context.todos.filter(({ id }): boolean => id !== todoId) });

        todosService.deleteTodo(todoId).then();
    };

    private onConfirmEditTodo = (updateTodo: ITodo): void => {
        const { activeTask, activeDate } = this.state;

        if (!activeTask.trim()) return;

        const newTodo = { ...updateTodo, task: activeTask, date: activeDate.getTime() };

        this.context.updateAppContext({ todos: this.context.todos.map((todo): ITodo => (todo.id === newTodo.id ? newTodo : todo)) });

        todosService.updateTodo(newTodo).then();

        this.setState({ editing: false });
    };

    private onCancelEditTodo = (): void => this.setState({ editing: false, activeTask: this.props.todo.task, activeDate: dateService.toDate(this.props.todo.date) });

    //#endregion ToDo_Actions
}

export default Todo;
