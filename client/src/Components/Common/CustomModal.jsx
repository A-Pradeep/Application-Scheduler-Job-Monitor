import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function CustomModal(props) {
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton onClick={props.funClose}>
          <Modal.Title>{props.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.modalBody}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.funClose}>
            No
          </Button>
          <Button variant="primary" onClick={props.funYes}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
