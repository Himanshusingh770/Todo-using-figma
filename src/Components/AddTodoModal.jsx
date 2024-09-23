import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const AddTodoModal = ({ show, onHide, addTodo, editTodo }) => {
  const [todoText, setTodoText] = useState('');
  const [todoTime, setTodoTime] = useState('');
  const [errors, setErrors] = useState({ text: '', time: '' });
  const [minDateTime, setMinDateTime] = useState('');

  useEffect(() => {
    const currentDateTime = new Date().toISOString().slice(0, 16); // Format to match 'YYYY-MM-DDTHH:MM'
    setMinDateTime(currentDateTime);

    if (editTodo) {
      setTodoText(editTodo.text);
      setTodoTime(editTodo.time);
      setErrors({ text: '', time: '' }); // Clear errors on opening
    } else {
      setTodoText('');
      setTodoTime('');
      setErrors({ text: '', time: '' }); // Clear errors
    }
  }, [editTodo, show]);

  const validateDateInput = (inputTime) => {
    const currentDate = new Date();
    const inputDate = new Date(inputTime);
    return inputDate < currentDate ? 'Past dates and times are not allowed.' : null;
  };

  const handleAdd = () => {
    let hasError = false;
    const newErrors = { text: '', time: '' }; // Reset errors

    if (!todoText.trim()) {
      newErrors.text = 'Todo text cannot be empty!';
      hasError = true;
    }

    if (!todoTime) {
      newErrors.time = 'Date and time cannot be empty!';
      hasError = true;
    } else {
      const validationError = validateDateInput(todoTime);
      if (validationError) {
        newErrors.time = validationError;
        hasError = true;
      }
    }

    setErrors(newErrors); // Update errors state

    if (hasError) return;

    const newTodo = {
      text: todoText,
      time: todoTime || new Date(),
      color: 'violet', // Set the default color
      completed: false,
    };

    addTodo(newTodo);
    onHide(); // Close modal after adding
  };

  return (
    <Modal show={show} onHide={onHide}>
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
          min={minDateTime} // This disables past dates and times
        />
        <div className="invalid-feedback">{errors.time}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleAdd}>Done</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTodoModal;
