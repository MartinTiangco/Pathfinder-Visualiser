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
    };
  }

  componentDidMount() {
    this.createInitialGrid(ROW_SIZE, COL_SIZE);
  }

  handleVisualiseDijkstra = () => {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodes = Dijkstra(startNode, finishNode, grid);
    this.showAnimation(visitedNodes);
    this.showPath(finishNode);
  };

  showPath = (finishNode) => {
    let shortestPathInOrder = [];
    shortestPathInOrder.push(finishNode);
    let currentNode = finishNode;
    while (currentNode.lastNode !== null) {
      shortestPathInOrder.push(currentNode.lastNode);
      currentNode = currentNode.lastNode;
    }
    shortestPathInOrder.reverse();
    this.animatePath(shortestPathInOrder);
  };

  animatePath = (shortestPathInOrder) => {
    for (let i = 0; i < shortestPathInOrder.length; i++) {
      setTimeout(() => {
        const { row, col } = shortestPathInOrder[i];
        // get the node from the HTML dom with the ID
        document
          .getElementById(`row-${row}-col-${col}`)
          .classList.add("node-path");
      }, 10 * i);
    }
  };

  showAnimation = (visitedNodes) => {
    for (let i = 0; i < visitedNodes.length; i++) {
      setTimeout(() => {
        const { row, col } = visitedNodes[i];
        // get the node from the HTML dom with the ID
        document
          .getElementById(`row-${row}-col-${col}`)
          .classList.add("node-visited");
      }, 10 * i);
    }
  };

  // creates the grid at startup
  createInitialGrid = (row, col) => {
    let grid = [];
    for (let i = 0; i < row; i++) {
      let currentRow = [];
      for (let j = 0; j < col; j++) {
        currentRow.push(this.createNode(i, j));
      }
      grid.push(currentRow);
    }

    this.setState({ grid });
  };

  // creates a singular node
  createNode = (row, col) => {
    return {
      row,
      col,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
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
