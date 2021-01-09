import React, { Component } from "react";

import todosService from "../../services/todosService";
import AppContext from "../../contexts/appContext";

import TodoForm from "./TodoForm";

class Home extends Component {
    static contextType = AppContext;

    async componentDidMount() {
        const todos = await todosService.getTodos();

        this.context.updateAppContext({ key: "todos", value: todos });
    }

    render() {
        return (
            <div className="home">
                <section className="todos-app container">
                    <TodoForm />
                </section>
            </div>
        );
    }
}

export default Home;
