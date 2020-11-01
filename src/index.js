import { makeTurnElements, turnRoll } from "./lib";

const main = () => {
  const state = {
    pool: makeTurnElements(5),
    rerollOne: [],
    rerollTwo: [],
    currentSelectedOne: [],
    currentSelectedTwo: [],
    finalElements: [],
    turnTotalSum: 0,
    rerollCounter: 1,
  };
  turnRoll(state, 5);
  console.log("first roll pool ", state.pool);
};

main();
