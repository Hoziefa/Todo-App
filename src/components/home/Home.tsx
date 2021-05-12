import React, { ChangeEvent, Component, ReactNode } from 'react';
import CreateTodo from './CreateTodo';
import TodosList from '../reusableComponents/TodosList';
import { SectionHeading } from '../reusableComponents/SectionHeading';
import UserProfile from '../reusableComponents/UserProfile';
import { AppContext } from '../../contexts/AppContext';
import { dataPersister, todosService } from '../../services';
import { DataPersistKeys } from 'types';

interface IHomeState {
    loading: boolean;
}

class Home extends Component<{}, IHomeState> {
    public static contextType = AppContext;

    context!: React.ContextType<typeof AppContext>;

    public readonly state: Readonly<IHomeState> = { loading: true };

    public render(): ReactNode {
        const { loading } = this.state;
        const { todos, filterDescription } = this.context;
        const filteredTodos = todos.filter(({ task }): boolean | undefined => task?.toLowerCase()?.includes(filterDescription?.toLowerCase()));

        return <div className="home">
            <section className="todos-app container">
                <UserProfile />

                <CreateTodo />

                <div className="todos section">
                    <SectionHeading title="to-do list">
                        <div className="field">
                            <input
                                type="text"
                                name="filterDescription"
                                placeholder="search to-do ..."
                                value={ filterDescription }
                                onChange={ this.onFilterByDescriptionInputChange }
                            />
                            <i className="fas fa-search" />
                        </div>

                        <button className="add-todo-btn" aria-label="add-todo" onClick={ this.onDisplayAddTodoModal }><i className="fas fa-plus" /></button>
                    </SectionHeading>

                    { loading
                        ? <div className="loader"><i className="fas fa-spinner fa-pulse fa-2x" /></div>
                        : (filteredTodos.length ? <TodosList todos={ filteredTodos } /> : <h5 className="message">no active to-do found!</h5>)
                    }
                </div>
            </section>
        </div>;
    }

    public async componentDidMount(): Promise<void> {
        this.context.updateAppContext({ todos: await todosService.getTodos() });

        this.setState({ loading: false });
    }

    private onFilterByDescriptionInputChange = ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>): void => {
        this.context.updateAppContext({ filterDescription: value });

        dataPersister.persistData(DataPersistKeys.DescriptionFilterKey, value);
    };

    private onDisplayAddTodoModal = (): void => {
        this.context.updateAppContext({ modal: true, filterDescription: '' });

        dataPersister.deleteData(DataPersistKeys.DescriptionFilterKey);
    };
}

export default Home;
