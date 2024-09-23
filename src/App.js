import React, { useEffect, useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import TodoList from './Components/TodoList';
import AddEditTodoModal from './Components/AddEditTodoModal';
import ConformDeleteModal from './Components/ConformDeleteModal';
import Header from './Components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PlusCircle } from 'react-bootstrap-icons';
import './App.css';


const App = () => {
  const [todos, setTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Centralized color update logic using useCallback
  const updateTodoColors = useCallback(() => {
    const updatedList = todos.map((todo) => {
      const timeDiff = (new Date(todo.time).getTime() - Date.now()) / (1000 * 60 * 60); // Time difference in hours
      let newColor = todo.color;

      if (timeDiff <= 0 && !todo.completed) {
        newColor = 'red'; // Time limit exceeded, change to red automatically
      }
      return { ...todo, color: newColor };
    });
    setTodos(updatedList);
  }, [todos]);

  useEffect(() => {
    const intervalId = setInterval(updateTodoColors, 60000);
    updateTodoColors(); // Initial color check on load

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [updateTodoColors]); // Include updateTodoColors in dependencies

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

  // Handler functions

  const handleEditTodo = (todo) => {
    setEditTodo(todo);
    setShowModal(true);
  };

  const handleDeleteTodo = (id) => {
    setTodoToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setTodos(todos.filter((todo) => todo.id !== todoToDelete));
    setTodoToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleAddTodo = (newTodo) => {
    if (editTodo) {
      setTodos(todos.map((todo) => (todo.id === editTodo.id ? newTodo : todo)));
      setEditTodo(null);
    } else {
      setTodos([...todos, { ...newTodo, id: Date.now() }]);
    }
  };

  const handleShowModal = () => {
    setEditTodo(null); // Clear edit state when adding new todo
    setShowModal(true);
  };

  const handleAddEditHideModal = () => setShowModal(false);

  const handleHideDeleteModal = () => setShowDeleteConfirm(false);

  return (
    <div className="container">
      <Header />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Today</h1>
        <Button
          variant="outline-primary"
          className="rounded-circle p-0 border-0"
          style={{ width: '50px', height: '50px', backgroundColor: 'white' }}
          onClick={handleShowModal}
        >
          <PlusCircle className="text-primary" size={40} />
        </Button>
      </div>

      {/* Pass the functions via props */}
      <TodoList
        todos={todos}
        onEdit={handleEditTodo}
        onDelete={handleDeleteTodo}
        toggleComplete={toggleTimeComplete}
      />
      
      <AddEditTodoModal
        show={showModal}
        onHide={handleAddEditHideModal}
        addTodo={handleAddTodo}
        editTodo={editTodo}
      />

   <ConformDeleteModal
    showModel={showDeleteConfirm}
    onHide={handleHideDeleteModal}
    onDelete={handleConfirmDelete}
    message="Do you really want to delete this todo?"
   />


    </div>
  );
};

export default App;
