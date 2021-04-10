import React, { ChangeEvent, ReactNode } from 'react';
import Form from './Form';
import { AppContext } from '../../contexts/AppContext';
import { todosService } from '../../services/TodosService';
import { dateService } from 'services/DateService';
import { fieldsFactory } from '../../utils';
import { IGeneratedFieldProps, ITodo } from 'types';

interface ITodoProps {
    todo: ITodo;
}

interface ITodoState {
    data: { activeTask: IGeneratedFieldProps; activeDate: IGeneratedFieldProps };
    errors: { activeTask: string; activeDate: string };
    editing: boolean;
}

class Todo extends Form<ITodoProps, ITodoState> {
    public static contextType = AppContext;

    context!: React.ContextType<typeof AppContext>;

    public readonly state: Readonly<ITodoState> = {
        data: {
            activeTask: fieldsFactory({ name: 'activeTask', value: this.props.todo.task, displayError: false }),
            activeDate: fieldsFactory({ name: 'activeDate', type: 'date', value: dateService.toDate(this.props.todo.date), element: 'date', displayError: false }),
        },
        errors: { activeTask: '', activeDate: '' },
        editing: false,
    };

    public render(): ReactNode {
        const { editing } = this.state;
        const { todo } = this.props;

        return (
            <li className={ `todo-item ${ todo.completed ? 'completed' : '' }` }>
                <span className="todo-created-date">{ dateService.diffFromNow(todo.timestamp) }</span>

                { !todo.completed && editing ? this.renderTodoEditMode() : this.renderTodoReadMode() }
            </li>
        );
    }

    protected onFormSubmit({ activeTask, activeDate }: { activeTask: string; activeDate: Date }): void {
        const { todo } = this.props;

        const newTodo = { ...todo, task: activeTask, date: activeDate.getTime() };

        this.context.updateAppContext({ todos: this.context.todos.map((todo): ITodo => (todo.id === newTodo.id ? newTodo : todo)) });

        todosService.updateTodo(newTodo).then();

        this.setState({ editing: false });
    }

    private renderTodoEditMode(): JSX.Element {
        const { data, errors } = this.state;

        return <form onSubmit={ this.onsubmit }>
            <div className="inputs-container">
                { this.renderField(data.activeTask, errors.activeTask) }
                { this.renderField(data.activeDate, errors.activeDate) }
            </div>

            <div className="actions">
                <button className="confirm-todo--btn" aria-label="confirm" type="submit">
                    <i className="fas fa-check" />
                </button>

                <button className="cancel-todo--btn" aria-label="cancel" type="button" onClick={ this.onCancelEditTodo }>
                    <i className="fas fa-times" />
                </button>
            </div>
        </form>;
    }

    private renderTodoReadMode(): JSX.Element {
        const { todo } = this.props;

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

    private onCompleteTodoChange = ({ currentTarget: { checked } }: ChangeEvent<HTMLInputElement>, updateTodo: ITodo): void => {
        this.context.updateAppContext({ todos: this.context.todos.map((todo): ITodo => (todo.id === updateTodo.id ? { ...todo, completed: checked } : todo)) });

        todosService.updateTodo({ ...updateTodo, completed: checked }).then();
    };

    //#region Actions
    private onEditTodoMode = (): void => this.setState({ editing: true });

    private onDeleteTodo = (todoId: string): void => {
        this.context.updateAppContext({ todos: this.context.todos.filter(({ id }): boolean => id !== todoId) });

        todosService.deleteTodo(todoId).then();
    };

    private onCancelEditTodo = (): void => this.setState({
        editing: false,
        data: {
            activeTask: this.resetField('activeTask', this.props.todo.task),
            activeDate: this.resetField('activeDate', dateService.toDate(this.props.todo.date)),
        },
        errors: this.clearErrors(),
    });

    //#endregion Actions
}

export default Todo;
