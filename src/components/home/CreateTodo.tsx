import React, { ReactNode } from 'react';
import Swal from 'sweetalert2';
import Form from '../reusableComponents/Form';
import Modal from '../reusableComponents/Modal';
import { AppContext } from '../../contexts/AppContext';
import { todosService } from '../../services';
import { fieldsFactory } from '../../utils';
import { DateFormatTypes, FieldAutoCompleteValues, FieldTypes, IGeneratedFieldProps, InputTypes, ValidationErrorStyle } from 'types';
import { arrayUtils } from '../../utils/ArrayUtils';

interface ITodoFormState {
    data: { task: IGeneratedFieldProps<string>, date: IGeneratedFieldProps<Date | null>; };
    errors: { task: string, date: string };
}

class CreateTodo extends Form<{}, ITodoFormState> {
    public static contextType = AppContext;

    context!: React.ContextType<typeof AppContext>;

    public readonly state: Readonly<ITodoFormState> = {
        data: {
            task: fieldsFactory({
                name: 'task',
                min: 3,
                autoComplete: FieldAutoCompleteValues.Off,
                label: 'what do you want to do?',
                validationlabel: 'new to-do',
                validationErrorStyle: ValidationErrorStyle.ValidationErrorUnderline,
            }),
            date: fieldsFactory({
                name: 'date',
                type: InputTypes.Date,
                value: null,
                element: FieldTypes.Date,
                icon: 'far fa-calendar-alt',
                validationlabel: 'date, time',
                validationErrorStyle: ValidationErrorStyle.ValidationErrorUnderline,
                dateFormat: DateFormatTypes.DateTime,
            }),
        },
        errors: { task: '', date: '' },
    };

    public render(): ReactNode {
        const { data, errors } = this.state;

        return (
            <div className="add-todo--form">
                <Modal active={ this.context.modal } onClose={ this.closeModal } className="add-todo--modal">
                    <div className="form-container">
                        <div className="form-wrapper">
                            <div className="title"><h2>create new to-do</h2></div>

                            <form onSubmit={ this.onsubmit } className="form">
                                <div className="inputs-container">
                                    { this.renderField(data.task, errors.task) }
                                    { this.renderField(data.date, errors.date) }
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

    protected onFormSubmit = ({ task, date }: { task: string; date: Date }): void => {
        const { data } = this.state;
        const isTodoPresent = arrayUtils.isItemPresent(this.context.todos, task, 'task');

        if (!isTodoPresent) {
            this.createNewTask(task, date).then();
            return;
        }

        Swal.fire({
            title: `You already have a to-do with "${ task }" as a value. Do you want to save it anyway?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: `Save`,
            denyButtonText: `Don't save`,
        }).then((result): void => {
            if (result.isConfirmed) {
                Swal.fire('Saved!', '', 'success').then();

                this.createNewTask(task, date).then();
            }
            else if (result.isDenied) {
                Swal.fire('To-do not saved', '', 'info').then();

                this.setState({ data: { ...data, task: this.resetField('task'), date: this.resetField('date', null) } });
            }
        });
    };

    private closeModal = (): void => {
        const { data } = this.state;

        this.context.updateAppContext({ modal: false });

        this.setState({ data: { ...data, task: this.resetField('task'), date: this.resetField('date', null) }, errors: this.clearErrors() });
    };

    private createNewTask = async (task: string, date: Date): Promise<void> => {
        const todo = { task, date: date.getTime(), createdAt: todosService.getTimestamp, completed: false };

        const newTodo = await todosService.createTodo(todo);

        this.context.updateAppContext({ todos: [...this.context.todos, newTodo], modal: false });

        this.setState({ data: { ...this.state.data, task: this.resetField('task'), date: this.resetField('date', null) } });
    };

    private shouldSubmitBtnBeDisabled(): boolean {
        const { errors, data } = this.state;

        return !!errors.task || !!errors.date || !data.task.value || !data.date.value;
    }
}

export default CreateTodo;
