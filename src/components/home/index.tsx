import { ChangeEvent, Component, ReactNode } from 'react';

import { todosService } from '../../services/TodosService';
import { AppContext } from '../../contexts/appContext';

import TodoForm from './TodoForm';
import TodosList from '../reusableComponents/TodosList';
import { SectionHeading } from '../reusableComponents/SectionHeading';
import UserProfile from '../reusableComponents/UserProfile';
import { dataPersister } from 'services/DataPersister';
import { EDataPersistKeys } from 'types';

interface IHomeState {
    loading: boolean;
}

class Home extends Component<{}, IHomeState> {
    public static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    public readonly state: Readonly<IHomeState> = { loading: true };

    public async componentDidMount(): Promise<void> {
        this.context.updateAppContext({ todos: await todosService.getTodos() });

        this.setState({ loading: false });
    }

    private onFilterByDescriptionInputChange = ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>): void => {
        this.context.updateAppContext({ filterDescription: value });

        dataPersister.persistData(EDataPersistKeys.DescriptionFilterKey, value);
    };

    private onDisplayAddTodoModal = (): void => {
        this.context.updateAppContext({ modal: true, filterDescription: '' });

        dataPersister.deleteData(EDataPersistKeys.DescriptionFilterKey);
    };

    public render(): ReactNode {
        const { loading } = this.state;
        const { todos, filterDescription } = this.context;

        const filteredTodos = todos.filter(({ task }) => task?.toLowerCase()?.includes(filterDescription?.toLowerCase()));

        return (
            <div className="home">
                <section className="todos-app container">
                    <UserProfile />

                    <TodoForm />

                    <div className="todos section">
                        <SectionHeading title="to-do list">
                            <div className="field">
                                <input
                                    type="text"
                                    name="filterDescription"
                                    placeholder="search to-do ..."
                                    value={filterDescription}
                                    onChange={this.onFilterByDescriptionInputChange}
                                />
                                <i className="fas fa-search"></i>
                            </div>

                            <button className="add-todo-btn" onClick={this.onDisplayAddTodoModal}>
                                <i className="fas fa-plus"></i>
                            </button>
                        </SectionHeading>

                        {loading ? (
                            <div className="loader">
                                <i className="fas fa-spinner fa-pulse fa-2x"></i>
                            </div>
                        ) : (
                            <>
                                {filteredTodos.length ? (
                                    <TodosList todos={filteredTodos} />
                                ) : (
                                    <h5 className="message">no active to-do found!</h5>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        );
    }
}

export default Home;
