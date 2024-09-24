import React, { useEffect, useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import TodoList from './Components/TodoList';
import AddEditTodoModal from './Components/AddEditTodoModal';
import ConfirmDeleteModal from './Components/ConfirmDeleteModal';
import Header from './Components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PlusCircle } from 'react-bootstrap-icons';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [showEditAddModal, setShowEditAddModal] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Load todos from localStorage when the component mounts
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos);
        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos);
        } else {
          console.error("Invalid data format in localStorage");
        }
      } catch (error) {
        console.error("Error parsing todos from localStorage", error);
      }
    }
    setLoading(false); // Set loading to false after fetching todos
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
    else {
         localStorage.removeItem('todos');
       }
  }, [todos]);

  const updateTodoColors = useCallback(() => {
    // Memoizing with empty dependency array to avoid re-creation on each render
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        const timeDiff = (new Date(todo.time).getTime() - Date.now()) / (1000 * 60 * 60); // Calculate time difference
        let newColor = todo.color;

        if (timeDiff <= 0 && !todo.completed) {
          newColor = 'red'; // Change color to red if time has passed and not completed
        }
        return { ...todo, color: newColor };
      });
    });
  }, []); // Empty array means this function is only created once

  // Call updateTodoColors at regular intervals without causing re-render loop
  useEffect(() => {
    const intervalId = setInterval(updateTodoColors, 60000); // Check every minute
    updateTodoColors(); // Initial call on mount

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [updateTodoColors]); // updateTodoColors is memoized, so it won't cause infinite re-renders

  const toggleTimeComplete = (id) => {
    const updatedList = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
        todo.color = todo.completed ? 'green' : 'violet';
      }
      return todo;
    });
    setTodos(updatedList);
  };

  const openConfirmEditModal = (todo) => {
    setEditTodo(todo);
    setShowEditAddModal(true);
  };

  const openConfirmDeleteModal = (id) => {
    setTodoToDelete(id);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    const updatedTodos = todos.filter((todo) => todo.id !== todoToDelete);
    setTodos(updatedTodos);
    setTodoToDelete(null);
    setShowDeleteConfirmModal(false);

    // Only remove from localStorage if the user deletes all todos
    if (updatedTodos.length === 0) {
      localStorage.removeItem('todos');
    }
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.getFullYear() > 1900; // Ensure year is valid
  };

  const handleAddEditTodo = (newTodo = null) => {
    if (newTodo && !isValidDate(newTodo.time)) {
      setError('Please enter a valid date and time.');
      return;
    }
    setError(''); // Clear error if valid

    if (editTodo && newTodo) {
      // Edit mode
      setTodos(todos.map((todo) => (todo.id === editTodo.id ? newTodo : todo)));
      setEditTodo(null); // Clear edit state
    } else if (newTodo) {
      // Add new todo
      setTodos([...todos, { ...newTodo, id: Date.now() }]);
    }
    setEditTodo(null); // Ensure we clear the edit state
    setShowEditAddModal(false); // Hide modal after adding/editing todos
  };

  const handleAddEditHideModal = () => setShowEditAddModal(false);
  const handleHideDeleteModal = () => setShowDeleteConfirmModal(false);

  // Do not render the UI until todos are loaded from localStorage
  if (loading) {
    return <div>Loading...</div>; // Simple loading indicator
  }

  return (
    <div className="container">
      <Header />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Today</h1>
        <Button
          variant="outline-primary"
          className="rounded-circle p-0 border-0"
          style={{ width: '50px', height: '50px', backgroundColor: 'white' }}
          onClick={() => setShowEditAddModal(true)} // Open modal to add a new todo
        >
          <PlusCircle className="text-primary" size={40} />
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <TodoList
        todos={todos}
        onEdit={openConfirmEditModal}
        onDelete={openConfirmDeleteModal}
        toggleComplete={toggleTimeComplete}
      />

      <AddEditTodoModal
        show={showEditAddModal}
        onHide={handleAddEditHideModal}
        addTodo={handleAddEditTodo}
        editTodo={editTodo}
      />

      <ConfirmDeleteModal
        showModal={showDeleteConfirmModal}
        onHide={handleHideDeleteModal}
        onDelete={handleConfirmDelete}
        message="Do you really want to delete this todo?"
      />
    </div>
  );
};

export default App;
