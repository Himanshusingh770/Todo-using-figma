import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConformDeleteModal = ({ showModel, onHide, onDelete, message }) => {
  return (
    <Modal show={showModel} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Todo</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message || 'Are you sure you want to delete this todo?'}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConformDeleteModal;
