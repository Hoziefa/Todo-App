import React from "react";
import Todo from "./Todo";

const TodosList = ({ todos }) => {
    return (
        <div className="todos-container section-content">
            <ul className="todos-list">
                {todos.map(todo => (
                    <Todo key={todo.id} todo={todo} />
                ))}
            </ul>
        </div>
    );
};

export default TodosList;
