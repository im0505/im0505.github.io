import { Difficulties, Rank } from "./constant.js";

const popup = document.createElement("div");
const title = document.createElement("div");
const howTo = document.createElement("button");
const seeRank = document.createElement("button");
const play = document.createElement("button");
const rank = document.createElement("div");
const time = document.createElement("div");
const max = document.createElement("div");
const disclosed = document.createElement("div");
const retry = document.createElement("button");

popup.style.width = "80vw";
popup.style.height = "80vh";
popup.style.top = "10vh";
popup.style.left = "10vw";
popup.style.position = "absolute";
popup.style.color = "white";
popup.style.backgroundColor = "black";
popup.style.boxShadow = "0 0 20px 20px black";
popup.style.display = "flex";
popup.style.flexDirection = "column";
popup.style.justifyContent = "space-evenly";
popup.style.fontSize = "30px";

// title.style.display = "none";
title.fontFamily = "gothic";
howTo.style.display = "none";
seeRank.style.display = "none";
play.style.display = "none";
title.style.color = "white";
howTo.style.color = "white";
seeRank.style.color = "white";
play.style.color = "white";
rank.style.color = "white";
max.style.color = "white";
time.style.color = "white";
retry.style.color = "white";
rank.style.fontFamily = "arial";
max.style.fontFamily = "arial";
time.style.fontFamily = "arial";
retry.style.fontFamily = "arial";
rank.style.fontStyle = "italic";
max.style.fontStyle = "italic";
time.style.fontStyle = "italic";
rank.style.alignSelf = "center";
max.style.alignSelf = "center";
time.style.alignSelf = "center";
title.style.alignSelf = "center";

title.innerText = "Can you beat Chimp?";
retry.innerText = "RETRY";
play.innerText = "PLAY";
howTo.innerText = "HOW";
seeRank.innerText = "RANK";
retry.style.background = "black";
howTo.style.background = "black";
seeRank.style.background = "black";
play.style.background = "black";
retry.style.fontSize = "30px";
howTo.style.fontSize = "30px";
seeRank.style.fontSize = "30px";
play.style.fontSize = "30px";

popup.appendChild(title);
popup.appendChild(howTo);
popup.appendChild(seeRank);
popup.appendChild(play);
popup.appendChild(rank);
popup.appendChild(max);
popup.appendChild(time);
popup.appendChild(disclosed);
popup.appendChild(retry);

function openPopup(result) {
  if (result) setData(result);
  if (popup.isConnected) return;
  else document.body.appendChild(popup);
}
function setData(result) {
  rank.innerText = `level failed!`;
  max.innerText = `max reach: ${result.maxReach}`;
  time.innerText = `time:  ${formatTime(result.time)}`;
  if (result.maxReach >= 9) {
    time.innerText += "\nYou beat Chimp!";
  }
}
function closePopup() {
  if (!popup.isConnected) return;
  popup.parentElement.removeChild(popup);
}

function formatTime(ms) {
  let hrs = 0,
    mins = 0,
    secs = 0;
  hrs = Math.floor(ms / 3600000);
  ms = ms % 3600000;
  mins = Math.floor(ms / 60000);
  ms = ms % 60000;
  secs = Math.floor(ms / 1000);
  ms = ms % 1000;

  let formated = [];
  if (hrs) {
    formated.push(hrs);
    formated.push("h ");
  }
  if (mins) {
    formated.push(mins);
    formated.push("m ");
  }
  formated.push(secs);
  if (ms) {
    formated.push(".");
    ms = ms.toString();
    if (ms.length === 1) ms = "00" + ms;
    if (ms.length === 2) ms = "0" + ms;
    if (ms[ms.length - 1] === "0") ms = ms.slice(0, ms.length - 1);
    if (ms[ms.length - 1] === "0") ms = ms.slice(0, ms.length - 1);
    formated.push(ms);
  }
  formated.push("s");
  return formated.join("");
}

function showHome() {
  howTo.style.display = "block";
  seeRank.style.display = "block";
  howTo.style.display = "block";
  play.style.display = "block";
  rank.style.display = "none";
  max.style.display = "none";
  time.style.display = "none";
  retry.style.display = "none";
}
function showPopup() {
  howTo.style.display = "none";
  seeRank.style.display = "none";
  howTo.style.display = "none";
  play.style.display = "none";
  rank.style.display = "block";
  max.style.display = "block";
  time.style.display = "block";
  retry.style.display = "block";
}

export {
  openPopup,
  closePopup,
  retry,
  play,
  seeRank,
  howTo,
  showHome,
  showPopup,
};
