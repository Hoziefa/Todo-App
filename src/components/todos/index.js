import Home from "../home";

import Calendar from "react-calendar";

import TodosList from "../reusableComponents/TodosList";
import SectionHeading from "../reusableComponents/SectionHeading";
import UserProfile from "../reusableComponents/UserProfile";

class Todos extends Home {
    onResetDate = () => {
        this.context.updateAppContext({ filterDate: new Date() });

        window.localStorage.removeItem("filterDate");
    };

    onDateChange = date => {
        this.context.updateAppContext({ filterDate: date });

        window.localStorage.setItem("filterDate", date);
    };

    render() {
        const { loading } = this.state;
        const { todos, filterDate } = this.context;

        const filteredTodos = todos.filter(
            ({ date }) => new Date(date).toDateString() === new Date(filterDate).toDateString(),
        );

        return (
            <div className="todos-page">
                <section className="todos-app container">
                    <UserProfile />

                    <div className="todos section">
                        <SectionHeading title="to-do list">
                            <div className="calendar-container">
                                <button className="clear-calendar--btn" onClick={this.onResetDate}>
                                    reset date <i className="fas fa-times"></i>
                                </button>

                                <Calendar onChange={this.onDateChange} value={filterDate} showDoubleView />
                            </div>
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

export default Todos;
