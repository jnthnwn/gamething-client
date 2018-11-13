const REPLAY = 'REPLAY';
export function replay() {
  return {
    type: REPLAY
  }
}

const START = 'START';
export function start() {
  return {
    type: START
  }
}

const SET_NAME = 'SET_NAME';
export function setName(name) {
  return {
    type: SET_NAME,
    name
  }
}
