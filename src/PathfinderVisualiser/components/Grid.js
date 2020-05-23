import React, { Component } from "react";
import Node from "./Node";
import "../css/Grid.css";
import { Dijkstra } from "../algorithms/Dijkstra";

// Constants
const ROW_SIZE = 7;
const COL_SIZE = 10;
const START_NODE_COL = 0;
const START_NODE_ROW = 0;
const FINISH_NODE_COL = 1;
const FINISH_NODE_ROW = 1;

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      rowSize: ROW_SIZE,
      colSize: COL_SIZE,
      startNodeCoords: { row: 0, col: 0 },
      finishNodeCoords: { row: 0, col: 0 },
    };
    this.grid = React.createRef();
  }

  componentDidMount() {
    this.createInitialGrid(ROW_SIZE, COL_SIZE, true);
  }

  /**
   * This method uses Dijkstra's Algorithm on the grid and shows the process visually.
   */
  handleVisualiseDijkstra = () => {
    const { grid, startNodeCoords, finishNodeCoords } = this.state;
    const startNode = grid[startNodeCoords.row][startNodeCoords.col];
    const finishNode = grid[finishNodeCoords.row][finishNodeCoords.col];
    const visitedNodes = Dijkstra(startNode, finishNode, grid); // returns an array of visited nodes with the shortest path
    this.showAnimation(visitedNodes, finishNode);
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
          this.getShortestPath(finishNode);
        }, 10 * i);
        return;
      }

      // loop through all the visited nodes
      setTimeout(() => {
        const { row, col } = visitedNodes[i];
        // get the node from the HTML dom with the ID
        document
          .getElementById(`row-${row}-col-${col}`)
          .classList.add("node-visited");
      }, 10 * i);
    }
  };

  /**
   * This method finds the shortest path by using the node object's LastVisited property.
   * It begins with the finishNode and backtracks all the way to the startNode. It creates an array from all
   * the nodes from the finishNode to the startNode, then reverses that array.
   * finishNode - singular node object that marks the finish
   */
  getShortestPath = (finishNode) => {
    let shortestPathInOrder = [];
    if (finishNode.isVisited === false) return;
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
   * Once we have the shortest path, we animate it by using the class "node-path".
   */
  animatePath = (shortestPathInOrder) => {
    for (let i = 0; i < shortestPathInOrder.length; i++) {
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
    this.createInitialGrid(ROW_SIZE, COL_SIZE, true);
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
      startNode = this.randomiseNodePosition(rows, cols, startNode);
      finishNode = this.randomiseNodePosition(rows, cols, finishNode);
      while (
        finishNode.row === startNode.row &&
        finishNode.col === startNode.col
      ) {
        finishNode = this.randomiseNodePosition(rows, cols, finishNode);
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

    this.buildWalls(grid);

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
  randomiseNodePosition = (rows, cols, node) => {
    let { row, col } = node;
    // chooses a random position
    row = Math.floor(Math.random() * rows);
    col = Math.floor(Math.random() * cols);
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
        if (Math.random() * 10 > 7) {
          const currentNode = grid[i][j];
          if (currentNode.isStart === true || currentNode.isFinish === true) {
            continue;
          }
          grid[i][j].isWall = true;
        }
      }
    }
  };

  /**
   * Creates a singular node object.
   * row, col - coordinates of the node
   * */
  createNode = (row, col) => {
    return {
      row,
      col,
      isStart: false,
      isFinish: false,
      isVisited: false,
      distance: Infinity,
      lastNode: null,
    };
  };

  render() {
    const { grid } = this.state;
    return (
      <>
        <button onClick={this.handleVisualiseDijkstra}>
          Visualise Dijkstra's Algorithm!
        </button>
        <button onClick={this.resetNodes}>Reset</button>
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
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
