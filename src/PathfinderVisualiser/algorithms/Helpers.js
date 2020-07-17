/**
 * Sorts the nodes by ascending distance order
 */
export function sortByDistance(nodes) {
  nodes.sort((nodeA, nodeB) => {
    return nodeA.distance - nodeB.distance;
  });
}

/**
 * Collects all nodes in the grid.
 */
export function collectAllNodes(grid) {
  let nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

/**
 * Updates neighbouring nodes that are unvisited to have distance of 0 and update their lastNode property to be the current node
 */
export function updateUnvisited(node, grid) {
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
export function getUnvisitedNeighbours(node, grid) {
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
