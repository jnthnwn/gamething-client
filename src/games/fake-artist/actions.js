const DRAW = 'DRAW';
export function draw(x, y) {
  return {
    type: DRAW,
    x, y
  }
}

const STOP_DRAW = 'STOP_DRAW';
export function stopDraw() {
  return {
    type: STOP_DRAW
  }
}

const START_TURN = 'START_TURN';
export function startTurn() {
  return {
    type: START_TURN
  }
}

const VOTE = 'VOTE';
export function vote(name) {
  return {
    type: VOTE,
    name
  }
}
