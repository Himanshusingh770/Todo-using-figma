import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Clock } from 'react-bootstrap-icons';

const TodoList = ({ todos, onEdit, onDelete, toggleComplete }) => {
  return (
    <div>
      {todos.length === 0 ? (
        <p>Todo List is Empty</p> // Message when no todos are available
      ) : (
        <ul className="todo-list">
          {todos.map((todo, index) => (
            <li key={index} className="todo-item">
              <input
                className="todo-radio"
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
              />
              <div className="todo-content">
                <div className="todo-text">{todo.text}</div>
                <div className="todo-time d-flex align-items-center">
                <span className="px-2"> {new Date(todo.time).toLocaleDateString()}</span> {/* Space added */}
                  <Clock className="pe-2 fs-5" />
                  <span>{new Date(todo.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  
                </div>
              </div>

              <span className={`status-dot ${todo.color}`}></span>
              <FaEdit className="icon" onClick={() => onEdit(todo)} style={{ cursor: 'pointer'  }} />
              <FaTrash className="icon" onClick={() => onDelete(todo.id)} style={{ cursor: 'pointer' }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
