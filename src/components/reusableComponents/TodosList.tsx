import React from 'react';
import Todo from './Todo';
import { ITodo } from 'types';

const TodosList: React.FC<{ todos: Array<ITodo> }> = ({ todos }): JSX.Element => {
    return (
        <div className="todos-container section-content">
            <div className="todos-info">
                <span className="all-todos">All tasks: {todos.length}</span>

                <span className="all-todos--incomplete">
                    incomplete: {todos.filter(({ completed }) => !completed).length}
                </span>

                <span className="all-todos--complete">complete: {todos.filter(({ completed }) => completed).length}</span>
            </div>

            <ul className="todos-list">
                {todos.map(todo => (
                    <Todo key={todo.id} todo={todo} />
                ))}
            </ul>
        </div>
    );
};

export default TodosList;
