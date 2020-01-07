import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function PopupModal(props) {
  var { postId, joinGroup, ...other } = props;
  const [input, setInput] = useState("");

  function handleSubmit() {
    joinGroup(postId, input);
    props.onHide();
  }

  return (
    <Modal
      {...other}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Group Size</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>How many people are in your group?</h4>
        <input
          name="peopleCount"
          type="number"
          min="1"
          max="3"
          step="1"
          defaultValue={input}
          onInput={e => setInput(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Submit</Button>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default PopupModal;
