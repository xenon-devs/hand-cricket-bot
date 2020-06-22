const difficultLevelModifierMap = [
  0, // Easy
  0.223, // Medium
  0.4123  // Hard
]

const getRandomFingers = (playersFingers, isBotBatting, difficulty, playerMoveHistory) => {
  let playerAvg = -1;

  // if (playerMoveHistory.length > 8) playerMoveHistory = playerMoveHistory.slice(1, 9);
  if (playerMoveHistory.length > 0) playerAvg = playerMoveHistory.reduce((sum, val) => sum + val) / playerMoveHistory.length;

  if (difficulty === Infinity) {
    if (isBotBatting) {
      if (playersFingers === 6) return 5;
      else return 6;
    }
    else {
      return playersFingers;
    }
  }
  else {
    let seed = Math.random()*7;

    if (isBotBatting) {
      if (Math.min(Math.floor(seed), 6) === playersFingers) {
        if (playersFingers === 6) seed -= difficultLevelModifierMap[difficulty]; 
        else seed += difficultLevelModifierMap[difficulty]; 
      }
    }
    else {
      if (playerAvg !== -1) seed += (playerAvg - seed) * difficultLevelModifierMap[difficulty] * 2;
      if (Math.min(Math.floor(seed), 6) !== playersFingers) {
        seed += (playersFingers - seed) * difficultLevelModifierMap[difficulty];
      }
    }
    return Math.min(Math.floor(seed), 6);
  }
}

module.exports = getRandomFingers;