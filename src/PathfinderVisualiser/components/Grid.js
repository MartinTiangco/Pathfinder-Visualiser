import React, { Component } from "react";
import { withGetScreen } from "react-getscreen";
import Node from "./Node";
import Key from "./Key";
import InfoModal from "./InfoModal";
import TutorialModal from "./TutorialModal";
import "../css/Grid.css";
import { Dijkstra } from "../algorithms/Dijkstra";
import { BFS } from "../algorithms/BFS";
import { DFS } from "../algorithms/DFS";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";

import { IoIosBuild } from "react-icons/io";
import { MdBorderClear } from "react-icons/md";
import { FiPlay, FiRefreshCw, FiInfo, FiHelpCircle } from "react-icons/fi";

// Constants
const START_NODE_COL = 0,
  START_NODE_ROW = 0,
  FINISH_NODE_COL = 1,
  FINISH_NODE_ROW = 1,
  WIDTH_BREAKPOINT = 1150;

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      rowSize: 0,
      colSize: 0,
      startNodeCoords: { row: 0, col: 0 },
      finishNodeCoords: { row: 0, col: 0 },
      mouseDown: false,
      screenWidth: null,
      isRunning: false,
      canReset: true,
      algorithmTitle: "",
      aboutShow: false,
      tutorialShow: false,
      previousNode: { row: 0, col: 0 },
    };
    this.grid = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.initialiseSize();
    });
    this.initialiseSize();
  }

  /**
   * Collects the number of rows and cols depending on where you access the webpage (i.e. on desktop, mobile or tablet).
   */
  initialiseSize = () => {
    const columns = this.grid.current.childNodes; // get iterable list of columns
    for (const column of columns) {
      // this returns HTML DOM elements with className = "column"
      for (const node of column.childNodes) {
        // iterate through the nodes in the DOM tree of the column
        node.classList.remove(`node-path`);
        node.classList.remove(`node-visited`);
      }
    }

    let rowSize = 0,
      colSize = 0;

    // Formula to determine how many columns the grid has
    let width = window.innerWidth;
    colSize = Math.floor((width - 50) / 35);

    // Formula to determine how many roms the grid has
    let height = window.innerHeight;
    if (width <= WIDTH_BREAKPOINT) {
      rowSize = Math.floor((height - 125) / 35);
    } else {
      rowSize = Math.floor((height - 250) / 35);
    }

    // defaults to row size and col size of 1
    if (colSize < 1) colSize = 1;
    if (rowSize < 1) rowSize = 1;

    this.createInitialGrid(rowSize, colSize, true);
    this.setState({
      rowSize,
      colSize,
    });
  };

  /**
   * This method uses Dijkstra's Algorithm on the grid and shows the process visually.
   */
  handleDijkstra = () => {
    this.setState(
      {
        isRunning: true,
        canReset: false,
      },
      () => {
        const { grid, startNodeCoords, finishNodeCoords } = this.state;
        const startNode = grid[startNodeCoords.row][startNodeCoords.col];
        const finishNode = grid[finishNodeCoords.row][finishNodeCoords.col];
        const visitedNodes = Dijkstra(startNode, finishNode, grid); // returns an array of visited nodes with the shortest path
        this.showAnimation(visitedNodes, finishNode);
      }
    );
  };

  /**
   * This method uses BFS on the grid and shows the process visually.
   */
  handleBFS = () => {
    this.setState(
      {
        isRunning: true,
        canReset: false,
      },
      () => {
        const { grid, startNodeCoords, finishNodeCoords } = this.state;
        const startNode = grid[startNodeCoords.row][startNodeCoords.col];
        const finishNode = grid[finishNodeCoords.row][finishNodeCoords.col];
        const visitedNodes = BFS(startNode, finishNode, grid); // returns an array of visited nodes with the shortest path
        this.showAnimation(visitedNodes, finishNode);
      }
    );
  };

  /**
   * This method uses DFS on the grid and shows the process visually.
   */
  handleDFS = () => {
    this.setState(
      {
        isRunning: true,
        canReset: false,
      },
      () => {
        const { grid, startNodeCoords, finishNodeCoords } = this.state;
        const startNode = grid[startNodeCoords.row][startNodeCoords.col];
        const finishNode = grid[finishNodeCoords.row][finishNodeCoords.col];
        const visitedNodes = DFS(startNode, finishNode, grid); // returns an array of visited nodes
        this.showAnimation(visitedNodes, finishNode);
      }
    );
  };

  /**
   * This method actually handles the animation of Dijkstra by editing the classNames of the nodes that were visited.
   * visitedNodes - array of nodes that were visited, retrieved from Dijkstra's Algorithm
   * finishNode - singular node object that marks the finish
   */
  showAnimation = (visitedNodes, finishNode) => {
    for (let i = 0; i <= visitedNodes.length; i++) {
      // we have completed the loop, now we animate the shortest path
      if (i === visitedNodes.length) {
        setTimeout(() => {
          this.getPath(finishNode);
        }, 30 * i);
        return;
      }

      // loop through all the visited nodes
      setTimeout(() => {
        const { row, col } = visitedNodes[i];
        // get the node from the HTML dom with the ID
        document
          .getElementById(`row-${row}-col-${col}`)
          .classList.add("node-visited");
      }, 30 * i);
    }
  };

  /**
   * This method finds the path taken by using the node object's LastVisited property.
   * It begins with the finishNode and backtracks all the way to the startNode. It creates an array from all
   * the nodes from the finishNode to the startNode, then reverses that array.
   * finishNode - singular node object that marks the finish
   */
  getPath = (finishNode) => {
    let shortestPathInOrder = [];
    if (finishNode.isVisited === false) {
      // if finishNode is blocked by walls
      this.setState({ canReset: true });
      return;
    }
    shortestPathInOrder.push(finishNode); // finishNode is first
    let currentNode = finishNode;

    // Iterate through all the nodes that were visited last until we have reached the startNode.
    // In other words, backtrack from the finishNode to the startNode.
    while (currentNode.lastNode !== null) {
      shortestPathInOrder.push(currentNode.lastNode);
      currentNode = currentNode.lastNode;
    }
    shortestPathInOrder.reverse(); // reverses the array
    this.animatePath(shortestPathInOrder); // animates the shortest path
  };

  /**
   * Once we have the path we took, we animate it by using the class "node-path".
   */
  animatePath = (shortestPathInOrder) => {
    for (let i = 0; i <= shortestPathInOrder.length; i++) {
      if (i === shortestPathInOrder.length) {
        setTimeout(() => {
          this.setState({ canReset: true });
        }, 50 * i);
        return;
      }

      setTimeout(() => {
        const { row, col } = shortestPathInOrder[i];
        // get the node from the HTML dom with the ID
        document
          .getElementById(`row-${row}-col-${col}`)
          .classList.add("node-path");
      }, 50 * i);
    }
  };

  /**
   * Removes the node-visited and node-path classes of the grid. Restarts the grid with new state
   */
  resetNodes = () => {
    const columns = this.grid.current.childNodes; // get iterable list of columns
    for (const column of columns) {
      // this returns HTML DOM elements with className = "column"
      for (const node of column.childNodes) {
        // iterate through the nodes in the DOM tree of the column
        node.classList.remove(`node-path`);
        node.classList.remove(`node-visited`);
      }
    }

    this.initialiseSize();
    this.setState({
      isRunning: false,
    });
  };

  /**
   * Creates the initial grid at startup and whenever the user clicks the reset button.
   * rows - the number of rows of the grid
   * cols - the number of cols of the grid
   * random (Default = false) - whether or not the startNode and finishNode are decided randomly.
   */
  createInitialGrid = (rows, cols, random = false) => {
    let startNode = { row: START_NODE_ROW, col: START_NODE_COL };
    let finishNode = { row: FINISH_NODE_ROW, col: FINISH_NODE_COL };

    // randomises the start and finish nodes
    if (random) {
      // In mobile, we pick either the first 3 rows or the last 3 rows to be the startNode and endNode's positions.
      // e.g. startNode can either be on the top or bottom 3 rows - the endNode gets to be in the other end
      // First, we pick either the top or bottom for startNode
      let choice = 0;
      if (this.props.isMobile()) {
        choice = Math.round(Math.random());
        if (choice === 0) {
          startNode = this.randomiseNodePosition(0, 3, 0, cols, startNode); // start will be in the top rows
          finishNode = this.randomiseNodePosition(
            rows - 3,
            rows,
            0,
            cols,
            finishNode
          ); // finish will be in the bottom rows
        } else {
          startNode = this.randomiseNodePosition(
            rows - 3,
            rows,
            0,
            cols,
            startNode
          ); // start will be in the bottom rows
          finishNode = this.randomiseNodePosition(0, 3, 0, cols, finishNode); // finish will be in the far left
        }
      } else {
        // the screen is either desktop or tablet mode
        choice = Math.round(Math.random());
        if (choice === 0) {
          startNode = this.randomiseNodePosition(0, rows, 0, 5, startNode); // start will be in the top rows
          finishNode = this.randomiseNodePosition(
            0,
            rows,
            cols - 5,
            cols,
            finishNode
          ); // finish will be in the bottom rows
        } else {
          startNode = this.randomiseNodePosition(
            0,
            rows,
            cols - 5,
            cols,
            startNode
          ); // start will be in the bottom rows
          finishNode = this.randomiseNodePosition(0, rows, 0, 5, finishNode); // finish will be in the top rows
        }
      }
    }

    // creates the initial grid
    let grid = [];
    for (let i = 0; i < rows; i++) {
      let currentRow = [];
      for (let j = 0; j < cols; j++) {
        currentRow.push(this.createNode(i, j));
      }
      grid.push(currentRow);
    }

    this.setStartAndFinish(grid, startNode, finishNode);

    this.setState({
      grid,
      startNodeCoords: { row: startNode.row, col: startNode.col },
      finishNodeCoords: {
        row: finishNode.row,
        col: finishNode.col,
      },
    });
  };

  /**
   * Randomises the position for a node.
   */
  randomiseNodePosition = (startRow, endRow, startCol, endCol, node) => {
    let { row, col } = node;
    // chooses a random row
    const randomRow = Math.floor(Math.random() * (endRow - startRow)) + 1;
    row = endRow - randomRow;
    // chooses random col
    const randomCol = Math.floor(Math.random() * (endCol - startCol)) + 1;
    col = endCol - randomCol;
    return { row, col };
  };

  /**
   * Edits the isStart and isFinish properties of the start node and finish nodes respectively
   */
  setStartAndFinish = (grid, startNode, finishNode) => {
    grid[startNode.row][startNode.col].isStart = true;
    grid[finishNode.row][finishNode.col].isFinish = true;
  };

  /**
   * Creates lists of walls randomly.
   */
  buildWalls = (grid) => {
    const rows = grid.length,
      cols = grid[0].length;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // insert algorithm here
        if (Math.random() * 10 > 9) {
          const currentNode = grid[i][j];
          if (currentNode.isStart === true || currentNode.isFinish === true) {
            continue;
          }
          grid[i][j].isWall = true;
        }
      }
    }
    this.setState({ grid });
  };

  /**
   * Clear all walls from the grid.
   */
  clearWalls = (grid) => {
    const rows = grid.length,
      cols = grid[0].length;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let currentNode = grid[i][j];
        if (currentNode.isWall) {
          grid[i][j].isWall = false;
        }
      }
    }
    this.setState({ grid });
  };

  /**
   * Creates a singular node object.
   * row, col - coordinates of the node
   */
  createNode = (row, col) => {
    return {
      row,
      col,
      isStart: false,
      isFinish: false,
      isVisited: false,
      distance: Infinity,
      lastNode: null,
      isWall: false,
    };
  };

  /**
   * The methods handleMouseUp, handleMouseDown, handleMouseEnter control the wall inputs from the user.
   * @param {*} row
   * @param {*} col
   */
  handleMouseUp = (row, col) => {
    const {
      grid,
      mouseDown,
      isRunning,
      movingStart,
      movingFinish,
    } = this.state;
    if (!mouseDown || isRunning) {
      return;
    }

    // collect the current node for use
    let currentNode = grid[row][col];

    // if we are moving the start node, then when we lift up the mouse click, we place on that node.
    if (movingStart) {
      currentNode.isWall = false;
      currentNode.isStart = true;
      this.setState({
        movingStart: false,
        previousNode: { row, col },
        startNodeCoords: { row, col },
      });
    } else if (movingFinish) {
      // if we are moving the finish node, then when we lift up the mouse click, we place the finish on that node.
      currentNode.isWall = false;
      currentNode.isFinish = true;
      this.setState({
        movingFinish: false,
        previousNode: { row, col },
        finishNodeCoords: { row, col },
      });
    }

    // when we are drawing walls
    if (!currentNode.isStart && !currentNode.isFinish) {
      currentNode.isWall = !currentNode.isWall;
    }

    this.setState({ mouseDown: false });
  };

  handleMouseEnter = (row, col) => {
    const {
      grid,
      mouseDown,
      isRunning,
      movingStart,
      movingFinish,
      previousNode,
    } = this.state;
    if (!mouseDown || isRunning) {
      return;
    }

    // collect the current node for use
    let currentNode = grid[row][col];

    // if we are moving the start node, we update the position to the current node and ensure that the previous node is no longer the start node.
    if (movingStart) {
      currentNode.isStart = true;
      grid[previousNode.row][previousNode.col].isStart = false;
      this.setState({ previousNode: { row, col } });
    } else if (movingFinish) {
      // same logic applies to the finish node as the start node
      currentNode.isFinish = true;
      grid[previousNode.row][previousNode.col].isFinish = false;
      this.setState({ previousNode: { row, col } });
    } else {
      // otherwise we are drawing a wall
      currentNode.isWall = !currentNode.isWall;
    }

    this.setState({ mouseDown: true });
  };

  handleMouseDown = (row, col) => {
    const { grid, isRunning } = this.state;

    if (isRunning) {
      return;
    }

    // collect the current node for use
    let currentNode = grid[row][col];

    // if the node is the start node, we pick it up.
    // We use the previousNode property to track the previous node we were on in the last iteration - so we can switch the previous node's "isStart" and "isFinish" property to the current node
    if (currentNode.isStart) {
      currentNode.isStart = false;
      this.setState({ movingStart: true, previousNode: { row, col } });
    } else if (currentNode.isFinish) {
      // we pick up the finish node
      currentNode.isFinish = false;
      this.setState({ movingFinish: true, previousNode: { row, col } });
    }

    this.setState({ mouseDown: true });
  };

  /**
   * Starts the visualisation of the algorithm that was selected from the dropdown list.
   */
  start = () => {
    let chosenAlgorithm = this.state.algorithmTitle;

    if (chosenAlgorithm === "Breadth-first Search") {
      this.handleBFS();
    } else if (chosenAlgorithm === "Depth-first Search") {
      this.handleDFS();
    } else if (chosenAlgorithm === "Dijkstra's Algorithm") {
      this.handleDijkstra();
    }
  };

  /**
   * Changes the state of algorithmTitle when selecting an algorithm option from the dropdown list
   * @param {String} name
   */
  chooseAlgorithm = (name) => {
    this.setState({ algorithmTitle: name });
  };

  /**
   * Shows the About modal.
   */
  showAbout = (isVisible) => {
    this.setState({ aboutShow: isVisible });
  };

  /**
   * Shows the Tutorial modal.
   */
  showTutorial = (isVisible) => {
    this.setState({ tutorialShow: isVisible });
  };

  render() {
    const { grid, aboutShow, tutorialShow } = this.state;
    let width = window.innerWidth;
    if (width >= WIDTH_BREAKPOINT) {
      // desktop or tablet
      return (
        <>
          <Navbar
            className="navbar"
            sticky="top"
            collapseOnSelect
            expand="lg"
            bg="dark"
            variant="dark"
          >
            <Navbar.Brand href="#">
              <span className="title">
                <span className="emphasis">Pathfinder Visualiser</span> by
                Martin Tiangco
              </span>
            </Navbar.Brand>
            <Nav className="col-auto">
              <NavDropdown
                title={this.state.algorithmTitle || "Choose an algorithm"}
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item
                  onClick={() => this.chooseAlgorithm("Breadth-first Search")}
                  active={this.state.algorithmTitle === "Breadth-first Search"}
                  href="#"
                >
                  Breadth-first Search
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => this.chooseAlgorithm("Depth-first Search")}
                  active={this.state.algorithmTitle === "Depth-first Search"}
                  href="#"
                >
                  Depth-first Search
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => this.chooseAlgorithm("Dijkstra's Algorithm")}
                  active={this.state.algorithmTitle === "Dijkstra's Algorithm"}
                  href="#"
                >
                  Djikstra's Algorithm
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className="mr-auto">
              <Button
                className="mr-sm-2"
                variant="success"
                onClick={this.start}
                disabled={
                  this.state.isRunning || this.state.algorithmTitle === ""
                }
              >
                <FiPlay /> Start visualising!
              </Button>
              <Button
                className="mr-sm-2"
                variant="info"
                onClick={() => this.buildWalls(grid)}
                disabled={this.state.isRunning}
              >
                <IoIosBuild /> Build Walls
              </Button>
              <Button
                className="mr-sm-2"
                variant="info"
                onClick={() => this.clearWalls(grid)}
                disabled={this.state.isRunning}
              >
                <MdBorderClear /> Clear Walls
              </Button>
              <Button
                className="mr-sm-2"
                variant="info"
                onClick={this.resetNodes}
                disabled={!this.state.canReset}
              >
                <FiRefreshCw /> Reset
              </Button>
            </Nav>
            <Nav>
              <Button
                className="mr-sm-2"
                variant="info"
                onClick={() => this.showTutorial(true)}
              >
                <FiHelpCircle /> Tutorial
              </Button>
              <Button variant="info" onClick={() => this.showAbout(true)}>
                <FiInfo /> About
              </Button>
            </Nav>
          </Navbar>
          <TutorialModal
            show={tutorialShow}
            onHide={() => this.showTutorial(false)}
          />
          <InfoModal show={aboutShow} onHide={() => this.showAbout(false)} />
          <div className="grid" ref={this.grid}>
            {grid.map((row, rowIdx) => {
              return (
                <div className="column" key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const {
                      row,
                      col,
                      isStart,
                      isFinish,
                      isWall,
                      isVisited,
                    } = node;
                    const { colSize } = this.state;
                    return (
                      <Node
                        key={rowIdx * colSize + nodeIdx}
                        row={row}
                        col={col}
                        isStart={isStart}
                        isFinish={isFinish}
                        isWall={isWall}
                        isVisited={isVisited}
                        onMouseDown={this.handleMouseDown}
                        onMouseUp={this.handleMouseUp}
                        onMouseEnter={this.handleMouseEnter}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
          <Key />
        </>
      );
    } else {
      // Mobile render
      return (
        <>
          <Navbar
            className="navbar"
            sticky="top"
            collapseOnSelect
            bg="dark"
            variant="dark"
          >
            <Nav className="mr-auto">
              <Button
                className="mr-2"
                variant="info"
                onClick={() => this.buildWalls(grid)}
                disabled={this.state.isRunning}
              >
                <IoIosBuild />
              </Button>
              <Button
                className="mr-2"
                variant="info"
                onClick={() => this.clearWalls(grid)}
                disabled={this.state.isRunning}
              >
                <MdBorderClear />
              </Button>
              <Button
                className="mr-2"
                variant="info"
                onClick={this.resetNodes}
                disabled={!this.state.canReset}
              >
                <FiRefreshCw />
              </Button>
            </Nav>

            <Nav>
              <NavDropdown
                title={this.state.algorithmTitle || "Choose an algorithm"}
                id="nav-dropdown"
              >
                <NavDropdown.Item
                  onClick={() => this.chooseAlgorithm("Breadth-first Search")}
                  active={this.state.algorithmTitle === "Breadth-first Search"}
                  href="#"
                >
                  Breadth-first Search
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => this.chooseAlgorithm("Depth-first Search")}
                  active={this.state.algorithmTitle === "Depth-first Search"}
                  href="#"
                >
                  Depth-first Search
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => this.chooseAlgorithm("Dijkstra's Algorithm")}
                  active={this.state.algorithmTitle === "Dijkstra's Algorithm"}
                  href="#"
                >
                  Djikstra's Algorithm
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar>
          <div className="grid" ref={this.grid}>
            {grid.map((row, rowIdx) => {
              return (
                <div className="column" key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const {
                      row,
                      col,
                      isStart,
                      isFinish,
                      isWall,
                      isVisited,
                    } = node;
                    const { colSize } = this.state;
                    return (
                      <Node
                        key={rowIdx * colSize + nodeIdx}
                        row={row}
                        col={col}
                        isStart={isStart}
                        isFinish={isFinish}
                        isWall={isWall}
                        isVisited={isVisited}
                        onMouseDown={this.handleMouseDown}
                        onMouseUp={this.handleMouseUp}
                        onMouseEnter={this.handleMouseEnter}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
          <Nav className="justify-content-center">
            <Button
              variant="success"
              onClick={this.start}
              disabled={
                this.state.isRunning || this.state.algorithmTitle === ""
              }
            >
              <FiPlay /> Start visualising!
            </Button>
          </Nav>
        </>
      );
    }
  }
}

export default withGetScreen(Grid);
