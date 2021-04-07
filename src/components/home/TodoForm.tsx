import React, { ReactNode } from 'react';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import Form from '../reusableComponents/Form';
import Modal from '../reusableComponents/Modal';
import { AppContext } from '../../contexts/AppContext';
import { todosService } from '../../services/TodosService';
import { inputGenerator } from '../../utils/misc';
import { IGeneratedInput } from 'types';

interface ITodoFormState {
    data: { task: IGeneratedInput<string> };
    errors: { task: string };
    date: Date | null;
}

class TodoForm extends Form<{}, ITodoFormState> {
    public static contextType = AppContext;

    context!: React.ContextType<typeof AppContext>;

    public readonly state: Readonly<ITodoFormState> = {
        data: {
            task: inputGenerator({
                name: 'task',
                min: 3,
                label: 'what do you want to do?',
                validationlabel: 'new to-do',
                validationErrorStyle: 'validation-error--underline',
                autoComplete: 'off',
            }),
        },
        errors: { task: '' },

        date: null,
    };

    public render(): ReactNode {
        const { data, errors, date } = this.state;

        return (
            <div className="add-todo--form">
                <Modal active={ this.context.modal } onClose={ this.closeModal } className="add-todo--modal">
                    <div className="form-container">
                        <div className="form-wrapper">
                            <div className="title"><h2>create new to-do</h2></div>

                            <form onSubmit={ this.onsubmit } className="form">
                                <div className="inputs-container">
                                    { this.renderInput(data.task, errors.task) }

                                    <div className="date--picker">
                                        <DatePicker selected={ date } dateFormat="Pp" showTimeSelect onChange={ (date: Date): void => this.setState({ date }) } />

                                        <i className="far fa-calendar-alt" />
                                    </div>
                                </div>

                                <div className="actions">
                                    <button type="submit" className="submit-btn" disabled={ this.shouldSubmitBtnBeDisabled() }>
                                        create <i className="fas fa-plus" />
                                    </button>

                                    <button type="button" className="cancel-btn" onClick={ this.closeModal }>
                                        cancel <i className="fas fa-times" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

    private closeModal = (): void => {
        this.context.updateAppContext({ modal: false });

        this.setState({
            data: { ...this.state.data, task: { ...this.state.data.task, value: '', active: false, touched: false } },
            errors: { ...this.state.errors, task: '' },
            date: null,
        });
    };

    private createNewTask = async (task: string, date: Date): Promise<void> => {
        const todo = { task, date: date.getTime(), timestamp: todosService.getTimestamp, completed: false };

        const newTodo = await todosService.createTodo(todo);

        this.context.updateAppContext({ todos: [...this.context.todos, newTodo], modal: false });

        this.setState({
            data: { ...this.state.data, task: { ...this.state.data.task, value: '', active: false, touched: false } },
            date: null,
        });
    };

    protected onFormSubmit = ({ task }: { task: string }): void => {
        const { date, data } = this.state;

        if (!date) return;

        if (this.context.todos.some(({ task: todoTask }): boolean => todoTask === task)) {
            Swal.fire({
                title: 'You already have to-do with this value. Do you want to save it anyway?',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: `Save`,
                denyButtonText: `Don't save`,
            }).then((result): void => {
                if (result.isConfirmed) {
                    Swal.fire('Saved!', '', 'success').then();

                    this.createNewTask(task, date!).then();
                }
                else if (result.isDenied) {
                    Swal.fire('To-do not saved', '', 'info').then();

                    this.setState({ data: { ...data, task: { ...data.task, value: '', active: false } }, date: null });
                }
            });
        }
        else this.createNewTask(task, date).then();
    };

    private shouldSubmitBtnBeDisabled(): boolean {
        const { data, errors, date } = this.state;

        return !!errors.task || !data.task.value || !date;
    }
}

export default TodoForm;
