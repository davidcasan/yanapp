export const getRandomId = () => "_" + Math.random().toString(26).substr(2, 9);

export const diceIds = ["a", "b", "c", "d", "e"];

export const rollDice = () => {
  const dice = Math.floor(Math.random() * 6) + 1;
  return dice;
};

export const makeTurnElements = () => ({
  id: getRandomId(),
  diceNumber: rollDice(),
  status: diceStatus.forChoose,
});

export const diceStatus = {
  forChoose: "for_choose",
  chosen: "chosen",
};

export const turnRoll = (state, numOfDices) => {
  const turnResults = [];
  for (let i = 0; i < numOfDices; i++) {
    turnResults.push(makeTurnElements());
  }
  state.pool = turnResults;

  updateTurnCounter(state);
};

export const updateTurnCounter = (state) => {
  let currTurnRef;
  if (state.rerollCounter === 1) {
    currTurnRef = state.pool;
  } else if (state.rerollCounter === 2) {
    currTurnRef = state.rerollOne;
  } else if (state.rerollCounter === 3) {
    currTurnRef = state.rerollTwo;
  }

  renderPool(currTurnRef);
  addEventListeners(state, currTurnRef);
};

export const clearState = (state) => {
  state.rerollCounter = 1;
  state.rerollOne = [];
  state.rerollTwo = [];
  state.currentSelectedOne = [];
  state.currentSelectedTwo = [];
  state.turnTotalSum = 0;
};

export const getTurnElements = (state, num, turnNumbersEl) => {
  state.finalElements = turnNumbersEl.filter((n) => n === num);
};

export const simpleSumElements = (state, num) => {
  const turnElRemainingSum = state.finalElements.reduce(
    (total, val) => total + val,
    0
  );
  state.turnTotalSum = turnElRemainingSum;
  console.log(state.turnTotalSum);

  updateResults(state, num);
};

export const addEventListeners = (state, currTurnRef) => {
  //
  const simpleSumController = (num) => {
    getTurnElements(
      state,
      num,
      currTurnRef.map((d) => d.diceNumber)
    );
    simpleSumElements(state, num);
  };

  const simpleSumEvent = document.getElementsByClassName("actionButton");

  [...simpleSumEvent].map(
    (filterEl) => (filterEl.onclick = () => simpleSumController(+filterEl.id))
  );

  const reRollButton = document.getElementById("re_roll_button");
  reRollButton.onclick = () => {
    selectDiceElements(
      state,
      currTurnRef.map((d) => d.diceNumber)
    );
    updateTurnCounter(
      state,
      currTurnRef.map((d) => d.diceNumber)
    );
  };

  const changeCellStatus = (currTurnRef, arrposition) => {
    if (currTurnRef[arrposition].status === diceStatus.forChoose) {
      currTurnRef[arrposition].status = diceStatus.chosen;
      console.log(`A ${currTurnRef[arrposition].status}`);
    } else {
      currTurnRef[arrposition].status = diceStatus.forChoose;
      console.log(`A ${currTurnRef[arrposition].status}`);
    }
  };

  const diceIds = ["a", "b", "c", "d", "e"];
  diceIds.map((id, index) => {
    document.getElementById(`dice_${id}_button`).onclick = () =>
      changeCellStatus(currTurnRef, index);
  });
};

export const updateResults = (state, num) => {
  document.getElementById(
    `${num}__total`
  ).innerHTML = `Total: ${state.turnTotalSum}`;
  clearState(state);
  turnRoll(state, 5);
};

diceIds.map((id, index) => {
  document.getElementById(`dice_${id}_button`).onclick = () =>
    changeCellStatus(currTurnRef, index);
});

export const renderPool = (currTurnRef) => {
  diceIds.map((id, index) => {
    document.getElementById(
      `ui_dice_${id}`
    ).innerHTML = `Dice: ${currTurnRef[index].diceNumber}`;
  });
};

export const selectDiceElements = (state, turnNumbersEl) => {
  if (state.rerollCounter === 1) {
    rerollOneController(state, turnNumbersEl);
    state.rerollCounter++;
  } else if (state.rerollCounter === 2) {
    rerollTwoController(state, turnNumbersEl);
    state.rerollCounter++;
  }
};

export const rerollOneController = (state, turnNumbersEl) => {
  diceIds.map((id, index) => {
    if (state.pool[index].status === diceStatus.chosen) {
      state.currentSelectedOne.push(state.pool[index]);
    }
  });

  fillTurnElements(state, turnNumbersEl);
};

export const rerollTwoController = (state, turnNumbersEl) => {
  diceIds.map((id, index) => {
    if (state.rerollOne[index].status === diceStatus.chosen) {
      state.currentSelectedTwo.push(state.rerollOne[index]);
    }
  });

  fillTurnElements(state, turnNumbersEl);
};

export const fillTurnElements = (state, turnNumbersEl) => {
  let numOfAddDices;
  if (state.rerollCounter === 1) {
    numOfAddDices = 5 - state.currentSelectedOne.length;
    turnRoll(state, 5);
    for (let i = 0; i < numOfAddDices; i++) {
      state.rerollOne.push(state.pool[i]);
    }

    for (let i = 0; i < state.currentSelectedOne.length; i++) {
      state.rerollOne.push(state.currentSelectedOne[i]);
    }
    updateTurnCounter(state, turnNumbersEl);
  } else if (state.rerollCounter === 2) {
    numOfAddDices = 5 - state.currentSelectedTwo.length;
    turnRoll(state, 5);
    for (let i = 0; i < numOfAddDices; i++) {
      state.rerollTwo.push(state.pool[i]);
    }

    for (let i = 0; i < state.currentSelectedTwo.length; i++) {
      state.rerollTwo.push(state.currentSelectedTwo[i]);
    }
    updateTurnCounter(state, turnNumbersEl);

    console.log("final");
  }
};
