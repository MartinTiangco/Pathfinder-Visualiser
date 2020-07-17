import { updateUnvisited, getUnvisitedNeighbours } from "./Helpers";

/*
 * Returns a list of visited nodes.
 */
export function DFS(startNode, finishNode, grid) {
  let visitedNodes = [];
  let unvisitedNodes = [startNode];
  startNode.distance = 0;

  let currentNode;
  while (unvisitedNodes.length > 0) {
    // remove the top of the stack, and work with this node for the current iteration
    currentNode = unvisitedNodes.pop();

    // skip if the node is a wall
    if (currentNode.isWall) continue;

    currentNode.isVisited = true;
    visitedNodes.push(currentNode);

    // found the finish, can exit loop
    if (currentNode === finishNode) break;

    // find its unvisited neighbours and update the distance and lastVisited properties of the neighbours
    let neighbourNodes = getUnvisitedNeighbours(currentNode, grid);
    updateUnvisited(currentNode, grid);

    // put the unvisited neighbours into the stack
    unvisitedNodes = unvisitedNodes.concat(neighbourNodes);
  }

  return visitedNodes;
}
