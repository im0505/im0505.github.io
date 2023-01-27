const radius = 30;
const margin = 15;
const K = 30;
const Difficulties = {
  baby: [
    [3000, 3],
    [2500, 4],
    [2500, 5],
  ],
  senior: [
    [2500, 6],
    [2250, 6],
    [2000, 6],
  ],
  child: [
    [2000, 7],
    [1800, 8],
    [1500, 9],
    [1250, 9],
  ],
  chimp: [
    [1000, 9],
    [800, 9],
    [500, 9],
    [275, 9],
    [100, 9],
  ],
};
const Rank = { 0: "baby", 1: "senior", 2: "child", 3: "chimp" };
export { radius, margin, K, Difficulties, Rank };
