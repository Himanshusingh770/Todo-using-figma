import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Clock } from 'react-bootstrap-icons';

const TodoList = ({ todos, onEdit, onDelete, toggleComplete }) => {
  const [updatedTodos, setUpdatedTodos] = useState([]);

  useEffect(() => {
    // Define the updateTodoColors function inside the useEffect
    const updateTodoColors = () => {
      const updatedList = todos.map((todo) => {
        const timeDiff = (new Date(todo.time).getTime() - Date.now()) / (1000 * 60 * 60); // Time difference in hours
        let newColor = todo.color;

        if (timeDiff <= 0 && !todo.completed) {
          newColor = 'red'; // Time limit exceeded, change to red automatically
        }

        return { ...todo, color: newColor };
      });

      setUpdatedTodos(updatedList);
    };

    // Run the color update function every 1 minute (60000 ms)
    const intervalId = setInterval(() => {
      updateTodoColors();
    }, 60000);

    // Run the color check on initial load
    updateTodoColors();

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [todos]); // UseEffect now depends only on `todos`

  const handleToggleComplete = (id) => {
    const updatedList = updatedTodos.map((todo) => {
      if (todo.id === id) {
        if (new Date(todo.time).getTime() < Date.now()) {
          // Time limit exceeded
          todo.color = todo.completed ? 'red' : 'green'; // Toggle between red and green
        } else {
          // Time not exceeded
          todo.color = todo.completed ? 'violet' : 'green'; // Toggle between violet and green
        }
        todo.completed = !todo.completed;
      }
      return todo;
    });
    setUpdatedTodos(updatedList);
    toggleComplete(id);
  };

  return (
    <div>
      {updatedTodos.length === 0 ? (
        <p>Add your todo</p> // Message when no todos are available
      ) : (
        <ul className="todo-list">
          {updatedTodos.map((todo, index) => (
            <li key={index} className="todo-item">
              <input
                className="todo-radio"
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
              />
              <div className="todo-content">
                <div className="todo-text">{todo.text}</div>
                <div className="todo-time d-flex align-items-center">
                  <Clock className="pe-2 fs-5" />
                  <span>{new Date(todo.time).toLocaleTimeString()}</span>
                  <span>{new Date(todo.time).toLocaleDateString()}</span>
                </div>
              </div>

              <span className={`status-dot ${todo.color}`}></span>
              <FaEdit className="icon" onClick={() => onEdit(todo)} />
              <FaTrash className="icon" onClick={() => onDelete(todo.id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
