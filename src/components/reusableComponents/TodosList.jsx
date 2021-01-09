import React from "react";

const TodosList = ({ list }) => {
    return (
        <div className="todos-container">
            <ul className="todos-list">
                {list.map(todo => (
                    <li key={todo.id} className="todo-item">
                        <p>{todo.content}</p>
                        <button className="complete-todo"></button>
                        <button className="delete-todo"></button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodosList;
