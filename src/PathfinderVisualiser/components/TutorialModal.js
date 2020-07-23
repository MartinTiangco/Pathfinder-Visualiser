import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FiHelpCircle } from "react-icons/fi";
import TutorialAlgorithms from "../assets/tutorial-algorithms.png";
import TutorialBuildClearWalls from "../assets/tutorial-build-clear-walls.png";
import TutorialReset from "../assets/tutorial-reset.png";
import TutorialStart from "../assets/tutorial-start.png";

export default function TutorialModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <FiHelpCircle className="mr-sm-2" />
          Tutorial
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Pathfinding Algorithms</h5>
        <p>
          These algorithms are used to find a path from point A to B. Some
          algorithms may give the shortest path (e.g. Dijkstra's Algorithm) but
          not all algorithms guarantee this property. This application
          visualises the whole process.
        </p>
        <hr />
        <h5>1) Choose an algorithm</h5>
        <p>From the dropdown list, you can choose an algorithm to visualise.</p>
        <img
          src={TutorialAlgorithms}
          alt="List of algorithms in the dropdown list"
        />
        <hr />
        <h5>2) Map Building Options</h5>
        <p>
          The <b>Build Walls</b>, <b>Clear Walls</b> buttons are used to create
          obstacles in the grid.
        </p>
        <img
          src={TutorialBuildClearWalls}
          alt="Build Walls and Clear Walls buttons"
        />
        <p>
          You can also <b>click and drag</b> the grid to make/delete walls.
        </p>
        <hr />
        <h5>3) Moving the start and target</h5>
        <p>
          On desktop, you can <b>drag</b> the Start and Target Nodes.
        </p>
        <hr />
        <h5>4) Start visualising!</h5>
        <p>Once you are happy with the map, you can start the program!</p>
        <img src={TutorialStart} alt="Start Visualising button" />
        <hr />
        <h5>5) Reset</h5>
        <p>
          After the program has completed visualising, you can reset the grid.
        </p>
        <img
          src={TutorialReset}
          alt="Reset button to reset the grid after visualising"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
