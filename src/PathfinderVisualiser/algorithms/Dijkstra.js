/*
 * Returns a list of visited nodes with least cost by using the Dijkstra's algorithm.
 */
export function Dijkstra(startNode, finishNode, grid) {
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

/**
 * Updates neighbouring nodes that are unvisited to have distance of 0 and update their lastNode property to be the current node
 */
function updateUnvisited(node, grid) {
  // in the grid, we find the node
  // mark the nodes adjacent to it with distance = 1
  const neighbourNodes = getUnvisitedNeighbours(node, grid);
  neighbourNodes.forEach((neighbour) => {
    neighbour.distance = node.distance + 1;
    neighbour.lastNode = node;
  });
}

/**
 * Get the unvisited neighbours one spot above, below, to the left, right of the current node.
 * Return neighbourNodes, an array of nodes that are unvisited
 */
function getUnvisitedNeighbours(node, grid) {
  let neighbourNodes = [];
  const { row, col } = node;
  // find the unvisited nodes one space away from the node
  if (row - 1 >= 0 && !grid[row - 1][col].isVisited)
    neighbourNodes.push(grid[row - 1][col]);
  if (row + 1 < grid.length && !grid[row + 1][col].isVisited)
    neighbourNodes.push(grid[row + 1][col]);
  if (col - 1 >= 0 && !grid[row][col - 1].isVisited)
    neighbourNodes.push(grid[row][col - 1]);
  if (col + 1 < grid[0].length && !grid[row][col + 1].isVisited)
    neighbourNodes.push(grid[row][col + 1]);
  return neighbourNodes;
}

/**
 * Sorts the nodes by ascending distance order
 */
function sortByDistance(nodes) {
  nodes.sort((nodeA, nodeB) => {
    return nodeA.distance - nodeB.distance;
  });
}

/**
 * Collects all nodes in the grid.
 */
function collectAllNodes(grid) {
  let nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}
