import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const AddEditTodoModal = ({ show, onHide, addTodo, editTodo }) => {
  const [formData, setFormData] = useState({
    todoText: '',
    todoTime: '',
  });
  
  const [errors, setErrors] = useState({ text: '', time: '' });
  const [minDateTime, setMinDateTime] = useState('');

  useEffect(() => {
    const currentDateTime = new Date().toISOString().slice(0, 16); // Format to match 'YYYY-MM-DDTHH:MM'
    setMinDateTime(currentDateTime);

    if (editTodo) {
      setFormData({
        todoText: editTodo.text,
        todoTime: editTodo.time,
      });
      setErrors({ text: '', time: '' }); // Clear errors on opening
    } else {
      setFormData({
        todoText: '',
        todoTime: '',
      });
      setErrors({ text: '', time: '' }); // Clear errors
    }
  }, [editTodo, show]);

  const validateDateInput = (inputTime) => {
    const currentDate = new Date();
    const inputDate = new Date(inputTime);
    
    // Check for invalid dates
    if (isNaN(inputDate)) {
      return 'Invalid date. Please enter a correct date.';
    }
    return inputDate < currentDate ? 'Past dates and times are not allowed.' : null;
  };

  const handleAdd = () => {
    let hasError = false;
    const newErrors = { text: '', time: '' }; // Reset errors

    if (!formData.todoText.trim()) {
      newErrors.text = 'Todo text cannot be empty!';
      hasError = true;
    }

    if (!formData.todoTime) {
      newErrors.time = 'Date and time cannot be empty!';
      hasError = true;
    } else {
      const validationError = validateDateInput(formData.todoTime);
      if (validationError) {
        newErrors.time = validationError;
        hasError = true;
      }
    }

    // Clear errors when fields are correctly filled
    setErrors(newErrors);
    
    if (hasError) return;

    const newTodo = {
      text: formData.todoText,
      time: formData.todoTime || new Date(),
      color: 'violet', // Set the default color
      completed: false,
    };

    addTodo(newTodo);
    onHide(); // Close modal after adding
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error if valid input
    if (name === 'todoText' && value.trim()) {
      setErrors((prev) => ({ ...prev, text: '' }));
    } else if (name === 'todoTime' && value) {
      const validationError = validateDateInput(value);
      if (!validationError) {
        setErrors((prev) => ({ ...prev, time: '' }));
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editTodo ? 'Edit Todo' : 'Add Todo'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea
          name="todoText"
          className={`form-control h-24 ${errors.text ? 'is-invalid' : ''}`}
          value={formData.todoText}
          onChange={handleInputChange}
        ></textarea>
        <div className="invalid-feedback">{errors.text}</div>
        <input
          name="todoTime"
          type="datetime-local"
          className={`form-control mt-3 ${errors.time ? 'is-invalid' : ''}`}
          value={formData.todoTime}
          onChange={handleInputChange}
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

export default AddEditTodoModal;
