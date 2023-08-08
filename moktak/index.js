// todo
// [x] 콤보시에 점수 더주기
// [x] play 연속 클릭 방지
// [x] 노래 끝났을때 처리
// 멈추기 기능
// 효과
// [x]3,2,1
// [x] 비트 클릭 효과
// [x] 콤보시 효과
// [x] 진동
// 진동끄기 버튼
// [x]목탁 이미지
// [x]부처 이미지
//
let playReady = false;
var sound = new Howl({
  // src: ['./banyasimgyeong-rimigseu.mp3'],
  src: ['./t3.mp3'],
});

sound.on('load', function () {
  playReady = true;
});
sound.on('end', function () {
  neckStart = 0;
});
// sound.on('pause', function () {});
let head, now, nowIdx;
let run = async function () {
  if (!playReady) {
    alert('music not loaded');

    return;
  }
  document.body.removeEventListener('keydown', keydownListener);
  document.body.removeEventListener('touchstart', keydownListener);
  document.body.addEventListener('keydown', keydownListener);
  document.body.addEventListener('touchstart', keydownListener);

  document.body.removeEventListener('keyup', keyupListener);
  document.body.removeEventListener('touchend', keyupListener);
  document.body.addEventListener('keyup', keyupListener);
  document.body.addEventListener('touchend', keyupListener);
  createRect(beats);
  await sleep(1);
  head = performance.now();
  neckStart = performance.now();
  nowIdx = 0;
  sound.play();
};
let combo = 0;
let score = 0;
//prettier-igore
const keyupListener = function () {
  pressing--;
};

const keydownListener = function (e) {
  if (navigator.vibrate && vibrateOn) navigator.vibrate(15);
  pressing++;
  if (!blocks[0]) return;
  let blockPos = blocks[0].y + blockHeight;
  let proximityValue = Math.abs(cHeight * hRatio - blockPos);
  if (proximityValue < 40) {
    combo++;
    let addScore = 0;
    if (proximityValue < 10) {
      addScore += 5;
      lastGrade = 5;
    } else if (proximityValue < 20) {
      addScore += 4;
      lastGrade = 4;
    } else if (proximityValue < 30) {
      addScore += 3;
      lastGrade = 3;
    } else {
      addScore += 2;
      lastGrade = 2;
    }
    if (combo > 29) addScore *= 3;
    else if (combo > 9) addScore *= 2;
    score += addScore;
    blocks.shift();
  } else {
    combo = 0;
    lastGrade = 1;
  }
};

const sleep = async function (sec) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, sec * 1000);
  });
};

///// canvas
const cWidth = 300,
  cHeight = 550;

let FPS = 60;
let count = 0;

function checkFPS() {
  count++;
  requestAnimationFrame(checkFPS);
}

checkFPS();

setTimeout(() => {
  checkFPS = function () {};
  if (count > 26 && count < 34) FPS = 30;
  if (count > 56 && count < 64) FPS = 60;
  accY = Number(Number(((1000 / FPS) * (cHeight * hRatio)) / 1000).toFixed(5));
  count = 0;
}, 1000);
const hRatio = 0.8;
const hLine = cHeight * hRatio;
let accY = Number(
  Number(((1000 / FPS) * (cHeight * hRatio)) / 1000).toFixed(5)
);
const acRng = 40;

const blockWidth = 100,
  blockHeight = 10;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let t1;

let moktak, body1, body2, head1, head2, glow1, glow2, glow3;
document.addEventListener(
  'DOMContentLoaded',
  () => {
    canvas.width = cWidth;
    canvas.height = cHeight;
    let fullDiv = document.createElement('div');
    fullDiv.id = 'canvasWrapper';
    fullDiv.style.width = 'fit-content';
    fullDiv.appendChild(canvas);
    document.body.appendChild(fullDiv);
    canvasWrapper = fullDiv;
    ctx.rect(0, 0, cWidth, cHeight);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 0.7 * cHeight);
    ctx.lineTo(cWidth, 0.7 * cHeight);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 10;
    ctx.stroke();
    window.requestAnimationFrame(() => {
      t1 = performance.now();
      draw();
    });

    // document.body.appendChild(start);
    moktak = document.querySelector('img');
    let imgs = document.body.querySelectorAll('img');
    body1 = imgs[1];
    body2 = imgs[2];
    head1 = imgs[3];
    head2 = imgs[4];
    glow1 = imgs[5];
    glow2 = imgs[6];
    glow3 = imgs[7];
    fitScreen();
    window.addEventListener('resize', fitScreen);

    let _321 = document.querySelector('#_321');
    document.querySelector('#play').addEventListener('click', () => {
      document.querySelector('#board').style.display = 'none';
      _321.style.display = 'flex';
      setTimeout(() => {
        _321.innerText = 2;
      }, 1000);
      setTimeout(() => {
        _321.innerText = 1;
      }, 2000);
      setTimeout(() => {
        _321.style.display = 'none';
      }, 3000);
      setTimeout(() => {
        run();
      }, 3000);
    });
  },
  { once: true }
);

function fitScreen() {
  let ratio1 = window.innerWidth / canvas.width;
  let ratio2 = window.innerHeight / canvas.height;
  let ratio3 = canvas.width / window.innerWidth;
  let ratio4 = canvas.height / window.innerHeight;

  scale = 0;
  canvas.style.position = 'absolute';
  let top = 0,
    left = 0;
  if (
    ratio1 * canvas.width <= window.innerWidth &&
    ratio1 * canvas.height <= window.innerHeight
  ) {
    if (ratio1 > scale) scale = ratio1;
  }
  if (
    ratio2 * canvas.width <= window.innerWidth &&
    ratio2 * canvas.height <= window.innerHeight
  ) {
    if (ratio2 > scale) scale = ratio2;
  }
  if (
    ratio3 * canvas.width <= window.innerWidth &&
    ratio3 * canvas.height <= window.innerHeight
  ) {
    if (ratio3 > scale) scale = ratio3;
  }
  if (
    ratio4 * canvas.width <= window.innerWidth &&
    ratio4 * canvas.height <= window.innerHeight
  ) {
    if (ratio4 > scale) scale = ratio4;
  }

  let div = canvasWrapper;

  div.style.transformOrigin = '0 0';
  div.style.transform = `scale(${scale})`;
  let rect = canvas.getBoundingClientRect();
  if (window.innerWidth > rect.width) {
    left = ((window.innerWidth - rect.width) * (1 / scale)) / 2;
  }
  if (window.innerHeight > rect.height) {
    top = ((window.innerHeight - rect.height) * (1 / scale)) / 2;
  }
  canvas.style.top = top + 'px';
  canvas.style.left = left + 'px';

  document.documentElement.scrollTop = 0;
}

let blocks = [];
const draw = function () {
  ctx.rect(0, 0, cWidth, cHeight);
  ctx.fillStyle = 'black';
  ctx.fill();
  displayMoktak();
  drawBuddha();
  drawHitLine();
  displayPress();
  drawBlocks();
  displayScore();

  window.requestAnimationFrame(draw);
};

function createRect(arr) {
  blocks = [];
  for (let i = 0; i < arr.length; i++) {
    setTimeout(() => {
      blocks.push({ x: cWidth * 0.9 - blockWidth, y: -50 });
    }, arr[i]);
  }
}

function drawHitLine() {
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(cWidth * 0.9, hRatio * cHeight - 15);
  ctx.lineTo(cWidth * 0.9 - blockWidth, hRatio * cHeight - 15);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawBlocks() {
  let len = blocks.length;
  ctx.fillStyle = 'red';
  for (let i = 0; i < len; i++) {
    let block = blocks[i];
    ctx.rect(block.x, block.y, blockWidth, blockHeight);
    ctx.fill();
    block.y += accY;

    if (block.y > hLine + acRng) {
      blocks.shift();
      i--;
      len--;
      combo = 0;
      lastGrade = 1;
    }
  }
  ctx.fillStyle = 'black';
}

let angle;
const statueX = 100,
  statueY = 50;
const glowX = statueX - 80,
  glowY = statueY - 120,
  glowXEnd = cWidth + 140,
  glowYEnd = cHeight - 100;
function drawBuddha() {
  let idx = getNeckAngle();
  let head = head1,
    body = body1;
  angle = neckAngles[idx];

  if (combo > 4) body = body2;
  if (combo > 14) {
    //glow
    if (idx === 0) ctx.globalAlpha = 0.4;
    else if (idx === 1) ctx.globalAlpha = 0.45;
    else if (idx === 2) ctx.globalAlpha = 0.5;
    else if (idx === 3) ctx.globalAlpha = 0.55;
    else if (idx === 4) ctx.globalAlpha = 0.6;
    else if (idx === 5) ctx.globalAlpha = 0.65;
    ctx.drawImage(glow1, glowX, glowY, glowXEnd, glowYEnd);
    if (idx === 0) ctx.globalAlpha = 0.65;
    else if (idx === 1) ctx.globalAlpha = 0.6;
    else if (idx === 2) ctx.globalAlpha = 0.55;
    else if (idx === 3) ctx.globalAlpha = 0.5;
    else if (idx === 4) ctx.globalAlpha = 0.45;
    else if (idx === 5) ctx.globalAlpha = 0.4;
    ctx.drawImage(glow2, glowX, glowY, glowXEnd, glowYEnd);
    if (idx === 0) ctx.globalAlpha = 0.4;
    else if (idx === 1) ctx.globalAlpha = 0.45;
    else if (idx === 2) ctx.globalAlpha = 0.5;
    else if (idx === 3) ctx.globalAlpha = 0.5;
    else if (idx === 4) ctx.globalAlpha = 0.45;
    else if (idx === 5) ctx.globalAlpha = 0.4;
    ctx.drawImage(glow3, glowX, glowY, glowXEnd, glowYEnd);
    ctx.globalAlpha = 1;
  }
  if (combo > 24) head = head2;

  ctx.drawImage(body, statueX, statueY, cWidth - statueX, cHeight - 300);
  ctx.drawImage(
    head,
    statueX - angle.x,
    statueY + angle.y,
    cWidth - statueX - angle.x,
    cHeight - 300 + angle.y
  );
  ctx.globalAlpha = 1;
}
let neckStart = 0;
let neckAngles = [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 0, y: 3 },
  { x: 0, y: 4 },
  { x: 1, y: 5 },
];
function getNeckAngle() {
  if (neckStart === 0) return 0;
  let ms = performance.now() - neckStart;
  if (ms > 375) ms = ms % 375;
  if (ms < 45) return 0;
  if (ms < 90) return 1;
  if (ms < 135) return 2;
  if (ms < 180) return 3;
  if (ms < 225) return 4;
  if (ms < 270) return 5;

  if (ms < 295) return 4;
  if (ms < 315) return 3;
  if (ms < 325) return 2;
  if (ms < 345) return 1;
  return 0;
}

function displayScore() {
  ctx.font = '15px Gothic';
  ctx.textAlign = 'start';
  ctx.fillStyle = 'white';
  ctx.fillText(`score: ${score}  combo: ${combo}`, 5, 15);
  displayGrade();
}
function displayMoktak() {
  if (moktak)
    ctx.drawImage(moktak, 50, hLine - cHeight / 7.5, cWidth - 75, cHeight / 3);
}
let lastGrade = null;
let gradeText = ['喝!', '良', '美', '優', '秀!'];
function displayGrade() {
  if (!lastGrade) return;
  ctx.font = '55px Gothic';
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'Black';
  let font;
  if (lastGrade === 1) {
    ctx.font = '65px Gothic';
    ctx.fillStyle = 'red';
    font = gradeText[0];
  } else if (lastGrade === 2) {
    font = gradeText[1];
  } else if (lastGrade === 3) font = gradeText[2];
  else if (lastGrade === 4) font = gradeText[3];
  else if (lastGrade === 5) {
    ctx.font = '65px Gothic';
    ctx.fillStyle = 'Gold';
    font = gradeText[4];
  }

  ctx.strokeText(font, 50, 170);
  ctx.fillText(font, 50, 170);
}

let pressing = 0;
let vibrateOn = true;
let canvasWrapper;
function displayPress() {
  if (pressing > 0) {
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(cWidth * 0.9, hRatio * cHeight - 15);
    ctx.lineTo(cWidth * 0.9 - blockWidth, hRatio * cHeight - 15);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 20;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}
const beats = [
  40, 838, 1630, 2035, 2436, 2824, 3208, 3576, 3950, 4320, 4710, 5467,
  //
  6891, 7082, 7266, 7634, 7821, 8005, 8170,
  //
  8379, 8740, 9112, 9448, 9855, 10200, 10954, 11323, 11687,
  //
  12062, 12434, 12798, 13171, 13538, 13908,
  //
  14651, 15017, 15200, 15756, 16133, 16504, 16867, 17051, 17233, 17604, 17973,
  //
  18338, 18711, 19076, 19450, 19630, 19815,
  //
  20003, 20557, 20922, 21293, 21665, 22038, 22410, 23143, 23514,
  //
  23885, 24252, 24619, 24991, 25350, 25446, 25729, 26469, 26834, 27200, 27569,
  27937,
  //
  28309, 28658, 29039, 29410, 29786, 30153, 30523, 30881, 31268, 31629, 32366,
  //
  32734, 33105, 33473, 33850, 34214, 34577, 34951, 35047, 35133, 35215,
  //
  35507, 35557, 35603, 35697, 36065, 36159, 36245, 36433, 36800, 36987,
  //
  37171, 27260, 37345, 37441, 37521, 37635, 37719, 37812, 37908, 38122, 38646,
  //
  39027, 39555, 40488, 41043, 41605, 41968, 42145, 42341, 42519, 42704,
  //
  42897, 43079, 43444, 43830, 44020, 44563, 44932, 46389,
  //
  48250, 48433, 48617, 48810, 49000, 49083, 49169, 49262, 49365, 49453, 49551,
  49643,
  //
  50093, 50462, 50836, 51569, 51940, 52312, 53052, 53423, 53777, 54524, 54897,
  55266,
  //
  56002, 56374, 56746, 57110, 57478, 57854, 58212, 58584, 58968, 59327, 59510,
  59698, 60068, 60251, 60432,
  //
  60812, 61126, 61930, 62287,
];
