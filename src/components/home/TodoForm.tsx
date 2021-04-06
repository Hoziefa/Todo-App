import { ReactNode } from 'react';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';

import { AppContext } from '../../contexts/appContext';

import { todosService } from '../../services/TodosService';
import { inputGenerator } from '../../utils/misc';

import Form from '../reusableComponents/Form';
import Modal from '../reusableComponents/Modal';
import { IGeneratedInput } from 'types';

interface ITodoFormState {
    data: { task: IGeneratedInput<string> };
    errors: { task?: string };
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
        errors: {},

        date: null,
    };

    public render(): ReactNode {
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
                                    {this.renderInput(data.task, errors.task!)}

                                    <div className="date--picker">
                                        <DatePicker
                                            selected={date}
                                            dateFormat="Pp"
                                            showTimeSelect
                                            onChange={(date: Date) => this.setState({ date })}
                                        />

                                        <i className="far fa-calendar-alt"></i>
                                    </div>
                                </div>

                                <div className="actions">
                                    <button type="submit" className="submit-btn" disabled={this.isDisabled()}>
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

        if (this.context.todos.some(({ task: todoTask }) => todoTask === task)) {
            Swal.fire({
                title: 'You already have to-do with this value. Do you want to save it anyway?',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: `Save`,
                denyButtonText: `Don't save`,
            }).then(result => {
                if (result.isConfirmed) {
                    Swal.fire('Saved!', '', 'success');

                    this.createNewTask(task, date!);
                } else if (result.isDenied) {
                    Swal.fire('To-do not saved', '', 'info');

                    this.setState({
                        data: { ...data, task: { ...data.task, value: '', active: false } },
                        date: null,
                    });
                }
            });
        } else {
            this.createNewTask(task, date);
        }
    };

    private isDisabled(): boolean {
        return !!this.state.errors.task || !this.state.data.task.value || !this.state.date;
    }
}

export default TodoForm;
