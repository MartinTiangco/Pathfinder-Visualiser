import { collectAllNodes, sortByDistance, updateUnvisited } from "./Helpers";

/*
 * Returns a list of visited nodes with least cost by using the Dijkstra's algorithm.
 */
export function BFS(startNode, finishNode, grid) {
  let visitedNodes = [startNode];
  startNode.distance = 0;
  let unvisitedNodes = collectAllNodes(grid);
  while (unvisitedNodes.length > 0) {
    sortByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift(); // removes the first element of unvisitedNodes

    // if closestNode is a wall, we continue because we can't do anything about it
    if (closestNode.isWall) continue;

    if (closestNode.distance === Infinity) return visitedNodes;

    closestNode.isVisited = true;
    visitedNodes.push(closestNode);
    if (closestNode === finishNode) break;
    updateUnvisited(closestNode, grid);
  }
  return visitedNodes;
}
