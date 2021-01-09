import Home from "../home";
import DatePicker from "react-datepicker";

import TodosList from "../reusableComponents/TodosList";
import SectionHeading from "../reusableComponents/SectionHeading";

class Todos extends Home {
    render() {
        const { loading } = this.state;
        const { todos, filterDate, updateAppContext, currentUser } = this.context;

        const filteredTodos = todos.filter(({ date }) => date >= filterDate);

        let icon = (
            <svg
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
                role="presentation"
                style={{ width: "42px", height: "38px" }}>
                <path fill="none" d="M0 0h24v24H0V0z" opacity=".87"></path>
                <g>
                    <path d="M3 14h4v-4H3v4zm0 5h4v-4H3v4zM3 9h4V5H3v4zm5 5h12v-4H8v4zm0 5h12v-4H8v4zM8 5v4h12V5H8z"></path>
                </g>
            </svg>
        );

        return (
            <div className="todos-page">
                <section className="todos-app container">
                    <div className="user-welcome">
                        <h2>Hey {currentUser?.displayName},</h2>
                        <p>Are you ready to complete your tasks?</p>
                    </div>

                    <div className="todos section">
                        <SectionHeading icon={icon} title="to-do list">
                            <DatePicker
                                selected={filterDate}
                                showTimeSelect
                                onChange={(date, e) => {
                                    updateAppContext({ filterDate: date.getTime() });

                                    window.localStorage.setItem("filterDate", date.getTime());
                                }}
                            />
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
