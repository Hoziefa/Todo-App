import { ReactNode } from 'react';
import Calendar, { OnChangeDateCallback } from 'react-calendar';

import TodosList from '../reusableComponents/TodosList';
import Home from '../home/Home';
import { SectionHeading } from '../reusableComponents/SectionHeading';
import UserProfile from '../reusableComponents/UserProfile';
import { dataPersister } from 'services/DataPersister';
import { dateService } from 'services/DateService';
import { EDataPersistKeys } from 'types';

class Todos extends Home {
    public render(): ReactNode {
        const { loading } = this.state;
        const { todos, filterDate } = this.context;
        const filteredTodos = todos.filter(({ date }): boolean => dateService.isSame(filterDate, date));

        return (
            <div className="todos-page">
                <section className="todos-app container">
                    <UserProfile />

                    <div className="todos section">
                        <SectionHeading title="to-do list">
                            <div className="calendar-container">
                                <button className="clear-calendar--btn" aria-label="clear" onClick={ this.onResetDate }>reset <i className="fas fa-times" /></button>

                                <Calendar onChange={ this.onDateChange } value={ filterDate } showDoubleView />
                            </div>
                        </SectionHeading>

                        { loading
                            ? <div className="loader"><i className="fas fa-spinner fa-pulse fa-2x" /></div>
                            : filteredTodos.length ? <TodosList todos={ filteredTodos } /> : <h5 className="message">no active to-do found!</h5>
                        }
                    </div>
                </section>
            </div>
        );
    }

    private onResetDate = (): void => {
        this.context.updateAppContext({ filterDate: dateService.toDate() });

        dataPersister.deleteData(EDataPersistKeys.DateFilterKey);
    };

    private onDateChange: OnChangeDateCallback = (date): void => {
        if (Array.isArray(date)) return;

        this.context.updateAppContext({ filterDate: date });

        dataPersister.persistData(EDataPersistKeys.DateFilterKey, date);
    };
}

export default Todos;
