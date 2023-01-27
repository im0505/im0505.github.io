export function sampling(width, height, radius, k) {
  function isValidPoint(grid, cellsize, gwidth, gheight, p, radius) {
    /* Make sure the point is on the screen */
    if (p.x < 0 || p.x >= width || p.y < 0 || p.y >= height) return false;

    /* Check neighboring eight cells */
    let xindex = Math.floor(p.x / cellsize);
    let yindex = Math.floor(p.y / cellsize);
    let i0 = Math.max(xindex - 1, 0);
    let i1 = Math.min(xindex + 1, gwidth - 1);
    let j0 = Math.max(yindex - 1, 0);
    let j1 = Math.min(yindex + 1, gheight - 1);

    for (let i = i0; i <= i1; i++)
      for (let j = j0; j <= j1; j++)
        if (grid[i][j] != null)
          if (dist(grid[i][j].x, grid[i][j].y, p.x, p.y) < radius) return false;

    /* If we get here, return true */
    return true;
  }

  function insertPoint(grid, cellsize, point) {
    let xindex = Math.floor(point.x / cellsize);
    let yindex = Math.floor(point.y / cellsize);
    grid[xindex][yindex] = point;
  }

  function poissonDiscSampling(radius, k) {
    const N = 2;
    const points = [];
    const active = [];
    const p0 = { x: Math.random() * width, y: Math.random() * height };
    const grid = [];
    const cellsize = Math.floor(radius / Math.sqrt(N));

    let ncellsWidth = Math.ceil(width / cellsize) + 1;
    let ncellsHeight = Math.ceil(height / cellsize) + 1;
    for (let i = 0; i < ncellsWidth; i++) {
      grid[i] = [];
      for (let j = 0; j < ncellsHeight; j++) {
        grid[i][j] = null;
      }
    }
    insertPoint(grid, cellsize, p0);
    points.push(p0);
    active.push(p0);

    while (active.length > 0) {
      let randomIdx = parseInt(Math.random() * active.length);
      let p = active[randomIdx];

      let found = false;

      for (let tries = 0; tries < k; tries++) {
        let theta = Math.random() * 360;
        let newRadius = Math.random() * radius + 2 * radius;
        let pnewx = p.x + newRadius * Math.cos(radians(theta));
        let pnewy = p.y + newRadius * Math.sin(radians(theta));
        let pnew = { x: pnewx, y: pnewy };
        if (
          !isValidPoint(grid, cellsize, ncellsWidth, ncellsHeight, pnew, radius)
        ) {
          continue;
        }
        points.push(pnew);
        insertPoint(grid, cellsize, pnew);
        active.push(pnew);
        found = true;
        break;
      }
      if (!found) {
        // console.log("set null");
        // active[randomIdx] = null;
        active.splice(randomIdx, 1);
      }
    }
    return points;
  }

  function dist(x1, y1, x2, y2) {
    let a = x1 - x2;
    let b = y1 - y2;
    return Math.sqrt(a * a + b * b);
  }

  function radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }

  return poissonDiscSampling(radius, k).filter((point) => {
    if (
      point.x - radius < 0 ||
      //   point.x + radius > width ||
      point.y - radius < 0
      //   point.y + radius > height
    ) {
      return false;
    }
    return true;
  });
}
