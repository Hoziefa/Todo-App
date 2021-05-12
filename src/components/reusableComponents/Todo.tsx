import React, { ChangeEvent, ReactNode } from 'react';
import Form from './Form';
import { AppContext } from '../../contexts/AppContext';
import { dateService, todosService } from '../../services';
import { fieldsFactory } from '../../utils';
import { FieldTypes, IGeneratedFieldProps, InputTypes, ITodo } from 'types';

interface ITodoProps {
    todo: ITodo;
}

interface ITodoState {
    data: { activeTask: IGeneratedFieldProps<string>; activeDate: IGeneratedFieldProps<Date | null> };
    errors: { activeTask: string; activeDate: string };
    editing: boolean;
}

class Todo extends Form<ITodoProps, ITodoState> {
    public static contextType = AppContext;

    context!: React.ContextType<typeof AppContext>;

    public readonly state: Readonly<ITodoState> = {
        data: {
            activeTask: fieldsFactory({ name: 'activeTask', value: this.props.todo.task, displayError: false }),
            activeDate: fieldsFactory({ name: 'activeDate', type: InputTypes.Date, value: dateService.toDate(this.props.todo.date), element: FieldTypes.Date, displayError: false }),
        },
        errors: { activeTask: '', activeDate: '' },
        editing: false,
    };

    public render(): ReactNode {
        const { editing } = this.state;
        const { todo } = this.props;

        return (
            <li className={ `todo-item ${ todo.completed ? 'completed' : '' }` }>
                <span className="todo__created-date">{ dateService.diffFromNow(todo.createdAt) }</span>

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
            <div className="todo__form__inputs-container">
                { this.renderField(data.activeTask, errors.activeTask) }
                { this.renderField(data.activeDate, errors.activeDate) }
            </div>

            <div className="todo__actions">
                <button className="todo__actions__confirm-btn" aria-label="confirm" type="submit">
                    <i className="fas fa-check" />
                </button>

                <button className="todo__actions__cancel-btn" aria-label="cancel" type="button" onClick={ this.onCancelEditTodo }>
                    <i className="fas fa-times" />
                </button>
            </div>
        </form>;
    }

    private renderTodoReadMode(): JSX.Element {
        const { todo } = this.props;

        return <>
            <div className="todo__complete-task">
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

            <div className="todo__task">
                <p>{ todo.task }</p>

                <span className="todo__task__estimate-date">{ dateService.format(todo.date) } - { dateService.diffFromNow(todo.date) }</span>
            </div>

            <div className="todo__actions">
                { !todo.completed && <button className="todo__actions__edit-btn" aria-label="edit" onClick={ this.onEditTodoMode }><i className="fas fa-pen" /></button> }

                <button className="todo__actions__delete-btn" aria-label="delete" onClick={ (): void => this.onDeleteTodo(todo.id!) }><i className="fas fa-trash" /></button>
            </div>
        </>;
    }

    //#region Actions
    private onCompleteTodoChange = ({ currentTarget: { checked } }: ChangeEvent<HTMLInputElement>, updateTodo: ITodo): void => {
        this.context.updateAppContext({ todos: this.context.todos.map((todo): ITodo => (todo.id === updateTodo.id ? { ...todo, completed: checked } : todo)) });

        todosService.updateTodo({ ...updateTodo, completed: checked }).then();
    };

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
