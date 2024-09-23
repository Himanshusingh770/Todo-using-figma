import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const TodoModal = ({ show, onHide, addTodo, editTodo }) => {
  const [todoText, setTodoText] = useState('');
  const [todoTime, setTodoTime] = useState('');
  const [errors, setErrors] = useState({ text: '', time: '' });

  useEffect(() => {
    if (editTodo) {
      // When editing, populate the fields with the current todo's values
      setTodoText(editTodo.text);
      setTodoTime(editTodo.time);
      setErrors({ text: '', time: '' }); // Clear errors when switching to Edit mode
    } else {
      // When adding a new todo, clear the fields and errors
      setTodoText('');
      setTodoTime('');
      setErrors({ text: '', time: '' });
    }
  }, [editTodo, show]);

  const handleAdd = () => {
    let hasError = false;

    // Check if the text input is empty
    if (!todoText.trim()) {
      setErrors(prev => ({ ...prev, text: 'Todo text cannot be empty!' }));
      hasError = true;
    } else {
      setErrors(prev => ({ ...prev, text: '' }));
    }

    // Check if the time input is empty
    if (!todoTime) {
      setErrors(prev => ({ ...prev, time: 'Please select a valid date and time!' }));
      hasError = true;
    } else {
      setErrors(prev => ({ ...prev, time: '' }));
    }

    if (hasError) return;

    const newTodo = {
      text: todoText,
      time: todoTime || new Date(),
      color: 'violet',
      completed: false,
    };

    addTodo(newTodo);
    onHide(); // Close the modal after successfully adding/editing the todo
  };

  // Reset the form and errors when modal is hidden
  const handleClose = () => {
    setErrors({ text: '', time: '' }); // Clear errors when modal closes
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editTodo ? 'Edit Todo' : 'Add Todo'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea
          className={`form-control h-24 ${errors.text ? 'is-invalid' : ''}`}
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        ></textarea>
        <div className="invalid-feedback">{errors.text}</div>

        <input
          type="datetime-local"
          className={`form-control mt-3 ${errors.time ? 'is-invalid' : ''}`}
          value={todoTime}
          onChange={(e) => setTodoTime(e.target.value)}
        />
        <div className="invalid-feedback">{errors.time}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAdd}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TodoModal;
