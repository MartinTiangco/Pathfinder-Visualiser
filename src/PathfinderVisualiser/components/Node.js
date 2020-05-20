import React, { Component } from "react";

import "../css/Node.css";

export default class Node extends Component {
  render() {
    const { isStart, isFinish, isWall, row, col } = this.props;
    let classNames = `node`;
    classNames += isStart ? ` node-start` : ``;
    classNames += isFinish ? ` node-finish` : ``;
    classNames += isWall ? ` node-wall` : ``;
    return <div id={`row-${row}-col-${col}`} className={classNames}></div>;
  }
}
