// utils/score.js
const scoreMap = new Map();

function toScore(username) {
  if (!scoreMap.has(username)) {
    scoreMap.set(username, 0);
  }
  return scoreMap;
}

function increaseScore(username) {
  if (scoreMap.has(username)) {
    scoreMap.set(username, scoreMap.get(username) + 1);
  }
}

export { scoreMap, toScore, increaseScore };
