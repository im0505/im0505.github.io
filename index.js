import { sampling } from "./sampling.js";
import {
  openPopup,
  closePopup,
  showHome,
  showPopup,
  retry,
  play,
  seeRank,
  howTo,
} from "./popup.js";
import { radius, margin, K, Difficulties, Rank } from "./constant.js";
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// TODO: if browser resize then restart whole round;
// TODO: set dificulty to cookie
// TODO: reset difficulty btn on home
// TODO: link the video at home

// TODO: fetch result
let gw = window.innerWidth;
let gh = window.innerHeight;
let seq = [];
let ans = 1;
let startTime;
let youAre = "baby";
let level = 0;
let rank = 0;
let difficulty = Difficulties[youAre][level];
let start = false;
let eraseTimeoutId = null;
let maxReach = 1;
ctx.strokeStyle = "white";

initialize();

//
console.time("a");
showHome();
openPopup();
// startRound();
console.timeEnd("a");
//

function startRound() {
  let [timeout, n] = difficulty;
  cleanup();
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let sample = sampling(gw, gh, radius * 2 + margin, K);
  let retry = 0;
  while (sample.length < n && retry < 5) {
    sample = sampling(gw, gh, radius * 2 + margin, K);
    retry++;
  }
  if (retry > 5) {
    alert("too small screen to play");
    throw new Error("screen too small to test");
  }
  for (let i = 0; i < n; i++) {
    const point = sample[i];
    seq.push(point);
    drawCircle(point);
    markNumber(point, i + 1);
  }
  //
  eraseNumber(timeout);
  //
}

function eraseNumber(timeout) {
  eraseTimeoutId = setTimeout(() => {
    for (const p of seq) drawCircle(p);
    start = true;
    startTime = Date.now();
  }, timeout);
}

function drawCircle(point) {
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.arc(point.x - radius, point.y - radius, radius, 0, 2 * Math.PI);
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.fill();
}
function markNumber(point, num) {
  ctx.fillStyle = "white";
  ctx.fillText(num, point.x - radius - margin + 2, point.y - margin + 2);
}

canvas.addEventListener("pointerdown", (e) => {
  if (!start && seq.length) {
    if (inCircle(e, seq[0])) {
      if (eraseTimeoutId) clearTimeout(eraseTimeoutId);
      eraseTimeoutId = null;
      startTime = Date.now();
      start = true;
      ans = 2;
      for (let i = 1; i < seq.length; i++) {
        drawCircle(seq[i]);
      }
    }
    return;
  }
  for (let i = ans - 1; i < seq.length; i++) {
    if (inCircle(e, seq[i])) {
      // console.log(i + 1, "clicked");
      if (i + 1 === ans) {
        // console.log("correct!");
        maxReach = Math.max(maxReach, i + 1);
        markNumber(seq[i], i + 1);
        if (i + 1 === seq.length) return roundClear();
        ans++;
      } else {
        // console.log("wrong answer");
        return done();
      }
    }
  }
});

function inCircle(point, circlePoint) {
  let cp = circlePoint;
  let dx = Math.abs(point.x - cp.x + radius);
  let dy = Math.abs(point.y - cp.y + radius);
  if (dx + dy <= radius) return true;
  if (dx ** 2 + dy ** 2 <= radius ** 2) return true;
  return false;
}

function roundClear() {
  // console.log("you have cleared round at ", Rank[rank]);
  // console.log("that was ", difficulty, "of difficulty");
  start = false;
  if (rank > 3) {
    if (difficulty[0] > 50) {
      difficulty[0] -= 1;
    }
    if (difficulty[1] < 30) difficulty[1]++;
    return;
  }
  if (level === Difficulties[youAre].length - 1) {
    level = 0;
    youAre = Rank[++rank];
  } else {
    level++;
  }
  difficulty = Difficulties[youAre][level];
  console.log("you're now on ", difficulty);

  startRound();
}

function done() {
  let result = {};
  result.time = Date.now() - startTime;
  if (seq.length === ans) result.clear = true;
  else result.clear = false;
  result.level = rank;
  result.difficulty = [...difficulty];
  result.maxReach = maxReach;
  cleanup();
  showRetry(result);
  return result;
}

function cleanup() {
  ans = 1;
  seq = [];
  startTime = null;
  start = false;
  if (eraseTimeoutId) clearTimeout(eraseTimeoutId);
  eraseTimeoutId = null;
}

function showRetry(result) {
  openPopup(result);
}

retry.addEventListener("click", () => {
  closePopup();
  startRound();
});

howTo.addEventListener("click", () => {
  //TODO : link video
  window.open("https://www.youtube.com/watch?v=zsXP8qeFF6A&t=65");
});
seeRank.addEventListener("click", () => {
  //TODO : link database;
  seeRank.innerText = "not implemented";
});

play.addEventListener("click", () => {
  closePopup();
  showPopup();
  startRound();
});

window.addEventListener("resize", () => {
  console.log("resize");
  initialize();
  startRound();
});

function initialize() {
  gw = window.innerWidth;
  gh = window.innerHeight;
  canvas.style.width = gw + "px";
  canvas.style.height = gh + "px";
  canvas.width = gw;
  canvas.height = gh;
  canvas.style.position = "absolute";

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "45px arial";
  ctx.fillStyle = "white";
  cleanup();
}
