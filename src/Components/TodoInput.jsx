import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const TodoInput = ({ addTodo }) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Title cannot be empty');
      return;
    }
    const newTodo = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      color: 'violet',
    };
    addTodo(newTodo);
    setTitle('');
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Todo
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter todo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TodoInput;
