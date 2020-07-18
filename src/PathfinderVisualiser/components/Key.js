import React from "react";
import Node from "./Node";

export default function Key() {
  return (
    <ul className="key">
      <li>
        <Node isKey={true} keyClass="node-start-key"></Node>
        <span className="key-align">Start Node</span>
      </li>
      <li>
        <Node isKey={true} keyClass="node-finish-key"></Node>
        <span className="key-align">Target Node</span>
      </li>
      <li>
        <Node isKey={true}></Node>
        <span className="key-align">Unvisited Node</span>
      </li>
      <li>
        <Node isKey={true} keyClass="node-visited-key"></Node>
        <span className="key-align">Visited Node</span>
      </li>
      <li>
        <Node isKey={true} keyClass="node-path-key"></Node>
        <span className="key-align">Path Node</span>
      </li>
      <li>
        <Node isKey={true} keyClass="node-wall-key"></Node>
        <span className="key-align">Wall Node</span>
      </li>
    </ul>
  );
}
