import { updateUnvisited, getUnvisitedNeighbours } from "./Helpers";

/*
 * Returns a list of visited nodes with least cost by using the Dijkstra's algorithm.
 */
export function BFS(startNode, finishNode, grid) {
  let visitedNodes = [];
  let unvisitedNodes = [startNode];
  startNode.distance = 0;

  while (unvisitedNodes.length > 0) {
    // get the first element in the queue
    let currentNode = unvisitedNodes.shift();

    if (currentNode.isVisited) continue;

    // skip if the node is a wall
    if (currentNode.isWall) continue;

    currentNode.isVisited = true;
    visitedNodes.push(currentNode);

    // found the finish, can exit loop
    if (currentNode === finishNode) break;

    // find its unvisited neighbours and update the distance and lastVisited properties of the neighbours
    let neighbourNodes = getUnvisitedNeighbours(currentNode, grid);
    updateUnvisited(currentNode, grid);

    // put the unvisited neighbours into the queue
    unvisitedNodes = unvisitedNodes.concat(neighbourNodes);
    console.log(unvisitedNodes);
  }
  return visitedNodes;
}
