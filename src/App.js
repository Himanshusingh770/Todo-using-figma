import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import TodoList from './Components/TodoList';
import TodoModal from './Components/TodoModal';
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

  const addTodo = (newTodo) => {
    if (editTodo) {
      setTodos(todos.map((todo) => (todo.id === editTodo.id ? newTodo : todo)));
      setEditTodo(null); // Reset the edit state after editing
    } else {
      setTodos([...todos, { ...newTodo, id: Date.now() }]);
    }
  };

  const handleEditTodo = (todo) => {
    setEditTodo(todo);
    setShowModal(true);
  };

  const deleteTodo = () => {
    setTodos(todos.filter((todo) => todo.id !== todoToDelete));
    setTodoToDelete(null);
    setShowDeleteConfirm(false);
  };

  const toggleComplete = (id) => {
    const updatedList = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
        todo.color = todo.completed ? 'green' : 'violet';
      }
      return todo;
    });
    setTodos(updatedList);
  };

  return (
    <div className="container">
      <Header />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Today</h1>
        <Button
          variant="outline-primary"
          className="rounded-circle p-0 border-0"
          style={{ width: '50px', height: '50px', backgroundColor: 'white' }}
          onClick={() => {
            setEditTodo(null); // Ensure edit state is cleared when adding new todo
            setShowModal(true);
          }}
        >
          <PlusCircle className="text-primary" size={40} />
        </Button>
      </div>
      <TodoList
        todos={todos}
        onEdit={handleEditTodo}
        onDelete={(id) => {
          setTodoToDelete(id);
          setShowDeleteConfirm(true);
        }}
        toggleComplete={toggleComplete}
      />
      <TodoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        addTodo={addTodo}
        editTodo={editTodo}
      />

      {/* Confirmation Modal for Deletion */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this todo?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteTodo}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
