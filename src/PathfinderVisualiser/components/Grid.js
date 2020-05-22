import React, { Component } from "react";
import Node from "./Node";
import "../css/Grid.css";
import { Dijkstra } from "../algorithms/Dijkstra";

// Constants
const ROW_SIZE = 20;
const COL_SIZE = 40;
const START_NODE_COL = 3;
const START_NODE_ROW = 3;
const FINISH_NODE_COL = 10;
const FINISH_NODE_ROW = 10;

export default class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      rowSize: ROW_SIZE,
      colSize: COL_SIZE,
      startNodeCoords: { startRow: 0, startCol: 0 },
      finishNodeCoords: { finishRow: 0, finishCol: 0 },
    };
  }

  componentDidMount() {
    this.createInitialGrid(ROW_SIZE, COL_SIZE, true, true);
    this.createMaze();
  }

  /**
   * This method uses Dijkstra's Algorithm on the grid and shows the process visually.
   */
  handleVisualiseDijkstra = () => {
    const { grid, startNodeCoords, finishNodeCoords } = this.state;
    const { startRow, startCol } = startNodeCoords;
    const { finishRow, finishCol } = finishNodeCoords;
    const startNode = grid[startRow][startCol];
    const finishNode = grid[finishRow][finishCol];
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
      if (i == visitedNodes.length) {
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
   * Creates the initial grid at startup and whenever the user clicks the reset button.
   * rows - the number of rows of the grid
   * cols - the number of cols of the grid
   * random (Default = false) - whether or not the startNode and finishNode are decided randomly.
   * firstLoad (Default = false) - this should be true upon the first load of the app. Upon reset, this is false.
   */
  createInitialGrid = (rows, cols, random = false, firstLoad = false) => {
    // clears the node-visited classname of all the nodes
    if (!firstLoad) {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          document.getElementById(`row-${i}-col-${j}`).className = "node";
        }
      }
    }

    let startRow = null;
    let startCol = null;
    let finishRow = null;
    let finishCol = null;

    // this block executes if the random startNode and finishNode mode is chosen.
    if (random) {
      // chooses a random start node
      startRow = Math.floor(Math.random() * rows);
      startCol = Math.floor(Math.random() * cols);
      // chooses a random finish node
      finishRow = Math.floor(Math.random() * rows);
      finishCol = Math.floor(Math.random() * cols);
      while (startRow === finishRow)
        finishRow = Math.floor(Math.random() * rows);
      while (startCol === finishCol)
        finishCol = Math.floor(Math.random() * cols);
    }

    let grid = [];
    for (let i = 0; i < rows; i++) {
      let currentRow = [];
      for (let j = 0; j < cols; j++) {
        currentRow.push(
          this.createNode(i, j, startRow, startCol, finishRow, finishCol)
        );
      }
      grid.push(currentRow);
    }

    this.setState(
      {
        grid,
        startNodeCoords: { startRow, startCol },
        finishNodeCoords: { finishRow, finishCol },
      },
      () => console.log(grid)
    );
  };

  /**
   * Creates a singular node object.
   * row, col - coordinates of the node
   * startRow, startCol (Default: START_NODE_ROW, START_NODE_COL) - coordinates of startNode
   * finishRow, finishCol (Default: FINISH_NODE_ROW, FINISH_NODE_COL) - coordinates of finishNode
   */
  createNode = (
    row,
    col,
    startRow = START_NODE_ROW,
    startCol = START_NODE_COL,
    finishRow = FINISH_NODE_ROW,
    finishCol = FINISH_NODE_COL
  ) => {
    return {
      row,
      col,
      isStart: row === startRow && col === startCol,
      isFinish: row === finishRow && col === finishCol,
      isWall: false,
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
        <button
          onClick={() => this.createInitialGrid(ROW_SIZE, COL_SIZE, true)}
        >
          Reset
        </button>
        <div className="grid">
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
