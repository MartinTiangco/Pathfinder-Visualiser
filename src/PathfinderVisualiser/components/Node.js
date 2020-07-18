import React, { Component } from "react";

import "../css/Node.css";

export default class Node extends Component {
  render() {
    const {
      isStart,
      isFinish,
      isWall,
      row,
      col,
      isKey,
      keyClass,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    } = this.props;

    // Figure out the type of the node
    let classNames = `node`;
    classNames += isStart ? ` node-start` : ``;
    classNames += isFinish ? ` node-finish` : ``;
    classNames += isWall ? ` node-wall` : ``;

    // Add specific class if the node is part of the Key/Legend
    if (isKey) {
      return <div className={`node-key ${keyClass}`}></div>;
    }

    return (
      <div
        id={`row-${row}-col-${col}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp(row, col)}
        className={classNames}
      ></div>
    );
  }
}
