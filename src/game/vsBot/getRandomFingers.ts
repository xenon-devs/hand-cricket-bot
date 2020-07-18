const difficultLevelModifierMap = [
  // These are random nos, don't worry
  0, // Easy
  0.223, // Medium
  0.4123  // Hard
]

/**
 * @description gives a number of fingers that is either random (if difficulty is easy) or depends on the move history avg.
 * @param playersFingers Number of fingers the player played (only for non-easy difficulties).
 * @param isBotBatting Whether the bot is batting or not.
 * @param difficulty A number signifying the difficulty (0 -> easy; 1 -> medium; 2 -> hard)
 * @param playerMoveHistory An array containing all of the player's past moves.
 */
const getRandomFingers = (
  playersFingers: number,
  isBotBatting: boolean,
  difficulty: number,
  playerMoveHistory: number[]
) => {
  let playerAvg = -1;

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

export default getRandomFingers;