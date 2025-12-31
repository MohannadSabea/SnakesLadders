import {
  board,
  pointersList,
  themeBtn,
  setupBtn,
  speedBtn,
  diceFaces,
  nextBtn,
  startBtn,
  inputsContainer,
  playersColorSetupContainer,
  stagesContainer,
  soloBtn,
  vsCpuBtn,
  vsPlayersBtn,
  mainStage,
  playersNumberInput,
  stages,
  stepsContainer,
  primaryLogo,
  gameOptionsMenu,
  newGameBtn,
  resetGameBtn,
  messageReplay,
  message,
  pointersContainer,
} from "./js/dom.js";
import Tweaker from "./js/arrayTweaker.js";
import exception from "./js/exceptions.js";
import Player from "./js/playersConstructor.js";
let interval = 0;
let active = 0;
let game = false;
let speed = 350;
let stage = 0;
let vsMode = 0;
let selections = 0;
const players = [];

const mainArray = new Tweaker(Array.from({ length: 100 }, (_, i) => i));
const evenSlices = new Tweaker(mainArray.array)
  .slicer(10)
  .filter((slice, i) => i % 2 === 0)
  .flat();
const slices = mainArray
  .slicer(10)
  .map((slice, i) => (i % 2 === 0 ? slice.reverse() : slice))
  .flat()
  .reverse();

slices.forEach((number) => {
  const box = document.createElement("li");
  box.classList.add("box");
  box.id = number + 1;
  board.append(box);
});

const stageSwitcher = () => {
  stages.forEach((stage) => stage.classList.add("hidden"));
  stages[stage].classList.remove("hidden");
  // stage < stages.length - 1 ? stage++ : (stage = stage);
  // stage === 1 ? (stage = 2) : (stage = 1);
  stage <= stages.length ? stage++ : false;
};

const colorSelectorController = (value) => {
  const R = Math.floor(Math.random() * value);
  const G = Math.floor(Math.random() * value);
  const B = Math.floor(Math.random() * value);
  return `rgb(${R}, ${G}, ${B})`;
};
const playerColorSetter = (e) => {
  const playerId = e.target.id.split("-")[1];
  players[+playerId].color = colorSelectorController(+e.target.value);
  document.querySelector(`.player-${playerId}-color`).style.backgroundColor =
    players[+playerId].color;
};

const playersPointersGenerator = () => {
  // if (vsMode === 1) count = 1;
  // if (vsMode === 2) count = 2;
  // for (let i = 0; i < count; i++) {
  //   // const pointerPlaceHolder = document.createElement("div");
  //   // pointerPlaceHolder.classList.add("pointer-placeholder");
  //   // const pointerElCloud = document.createElement("div");
  //   // pointerElCloud.className = "cloud";
  //   // const pointerElCharacter = document.createElement("div");
  //   // pointerElCharacter.className = `pointer pointer-${i + 1} pointer-right`;
  //   // pointerEl.style.backgroundColor = players[i].color;
  //   // pointerPlaceHolder.append(pointerElCharacter);
  //   // pointerPlaceHolder.append(pointerElCloud);
  //   // pointersList.append(pointerPlaceHolder);
  //   // players[i].pointer = pointerElCloud;
  // }
  players
    .map((p) => p.pointer)
    .forEach((pointer) => {
      const pointerPlaceHolder = document.createElement("div");
      pointerPlaceHolder.classList.add("pointer-placeholder");
      pointerPlaceHolder.append(pointer);
      pointersList.append(pointerPlaceHolder);
    });
};
const stageSwitcherController = () => {
  const inputsEls = document.querySelectorAll(".name-input");

  if (
    stage === 2 &&
    Array.from(inputsEls).every((input) => input.value.length > 0)
  ) {
    inputsEls.forEach((input, i) => (players[i].name = input.value));

    stageSwitcher();
    // document.querySelector(`#step-${stage}`).classList.add("active-step");
    return;
  }
  if (
    stage === 3 &&
    players.every((player) => player.color && player.pointer)
  ) {
    document.querySelector(".game-setup").classList.add("hidden");
    // playersPointersGenerator(+playersNumberInput.value);
  }
};
const charactersPointers = [
  { id: "pt-0", bg: "pointer-1", isSelected: false },
  { id: "pt-1", bg: "pointer-2", isSelected: false },
  { id: "pt-2", bg: "pointer-3", isSelected: false },
  { id: "pt-3", bg: "pointer-4", isSelected: false },
];
const playerPointerSelectController = () => {
  pointersContainer.innerHTML = "";
  charactersPointers.forEach((pointer, i) => {
    const pointerEl = document.createElement("span");
    pointerEl.id = pointer.id;
    pointerEl.className = `pointers-selector ${pointer.bg}`;

    !pointer.isSelected ? pointersContainer.append(pointerEl) : false;
  });
};
const inputTextElementController = () => {
  // if (vsMode === 1) {
  //   count = 1;
  // }
  // if (vsMode === 2) {
  //   count = 2;
  // }
  for (let i = 0; i < players.length; i++) {
    const listItem = document.createElement("li");
    listItem.classList.add("name-wrapper");
    const nameInput = document.createElement("input");
    nameInput.classList.add("name-input");
    if (vsMode === 2 && i === 1) nameInput.value = "CPU";
    nameInput.placeholder =
      vsMode === 2 && i === 1 ? `CPU` : `player ${i + 1}`.toUpperCase();

    listItem.append(nameInput);
    inputsContainer.append(listItem);
  }
};
const inputRangeElementController = () => {
  // if (vsMode === 1) count = 1;
  // if (vsMode === 2) count = 2;
  for (let i = 0; i < players.length; i++) {
    const colorRange = document.createElement("input");
    colorRange.type = "range";
    colorRange.min = 0;
    colorRange.max = 255;
    colorRange.step = 1;
    colorRange.value = 125;
    colorRange.id = `range-${i}`;
    const colorView = document.createElement("span");
    colorView.className = `player-color player-${i}-color`;
    const colorWrapper = document.createElement("li");
    colorWrapper.className = `color-range-wrapper`;
    colorWrapper.append(colorRange, colorView);
    playersColorSetupContainer.append(colorWrapper);
  }
};
const stepsGenerator = () => {
  for (let i = 0; i < stages.length; i++) {
    const stepEl = document.createElement("span");
    stepEl.classList.add("spot");
    if (i === 0) stepEl.classList.add("active-spot");
    stepEl.id = `spot-${i + 1}`;
    stepEl.textContent = i + 1;
    stepsContainer.append(stepEl);
  }
};
const playersCount = () => {
  for (let i = 0; i < +playersNumberInput.value; i++)
    players.push(new Player());
};
const setupGameController = () => {
  if (
    +playersNumberInput.value &&
    typeof +playersNumberInput.value === "number" &&
    +playersNumberInput.value > 0 &&
    +playersNumberInput.value < 5
  ) {
    playersCount();
    inputTextElementController();
    inputRangeElementController();

    // stagesContainer.classList.toggle("hidden");
    // document.querySelector(`.step-${stage}`).classList.toggle("hidden");
    stageSwitcher();
    // stepsGenerator();
  }
};
const isException = () =>
  //prettier-ignore
  exception
  .map((exception) => exception[0])
  .includes(players[active].score);

const finishGameModalController = () => {
  message.classList.toggle("hidden");
  startBtn.removeAttribute("disabled");
  speedBtn.classList.add("speed");
};

const startBtnController = () => {
  startBtn.classList[
    `${startBtn.classList.contains("bounce") ? "remove" : "add"}`
  ]("bounce");
  startBtn.style.backgroundColor = players[active]?.color;
  startBtn.textContent = game ? players[active].name : "Start";
};
const playerSwitchController = () => {
  // players[active].pointer.classList.remove("active");
  active < players.length - 1 ? active++ : (active = 0);
  startBtnController();
  diceFaces.forEach((face) => {
    face.classList.add("hidden");
    face.classList.remove("dice-roll");
  });
  // players[active].pointer.classList.toggle("active");
  // players[active].pointer.classList.add("active");
};
const pointerDirectionController = (step) =>
  evenSlices.includes(step)
    ? players[active].pointer.classList.add("pointer-right")
    : players[active].pointer.classList.remove("pointer-right");
const engine = () => {
  if (game) {
    const dice = Math.floor(Math.random() * 6) + 1;
    players[active].score += dice;
    players[active].prevScore = players[active].score - dice;

    startBtnController();
    startBtn.setAttribute("disabled", true);
    diceFaces.forEach((face) => {
      const id = face.id.split("-")[1];
      face.style.backgroundColor = players[active].color;
      face.classList[`${+id === dice ? "remove" : "add"}`]("hidden");
      face.classList.add("dice-roll");
    });

    if (players[active].score > slices.length) {
      players[active].score = players[active].prevScore;
      players.length > 1 ? playerSwitchController() : false;
      startBtn.removeAttribute("disabled");
      return;
    }

    for (let i = players[active].prevScore; i <= players[active].score; i++) {
      setTimeout(() => {
        pointerDirectionController(i);
        document.getElementById(`${i}`)?.append(players[active].pointer);

        if (i === players[active].score) {
          if (players[active].score === 100) {
            setTimeout(() => {
              game = false;
              finishGameModalController();
            }, interval + 200);
            return;
          }
          if (isException()) {
            const match = exception.find(
              (exception) => exception[0] === players[active].score
            );
            players[active].score = match[1];

            setTimeout(() => {
              pointerDirectionController(players[active].score);
              document
                .getElementById(`${players[active].score}`)
                .append(players[active].pointer);
              if (players[active].score === 100) {
                game = false;
                finishGameModalController();
                // startBtn.classList.remove("bounce");

                return;
              }
              playerSwitchController();
              startBtn.removeAttribute("disabled");
              interval = 0;
            }, interval + 500);
            return;
          }

          playerSwitchController();
          startBtn.removeAttribute("disabled");
        }

        interval = 0;
      }, (interval += speed));
    }
  }
};

const themeSwitcherController = () => {
  document.body.classList.toggle("dark-theme");
  themeBtn.textContent = document.body.classList.contains("dark-theme")
    ? "dark_mode"
    : "light_mode";
};
const roundSpeedController = () => {
  speed === 350 ? (speed = 250) : (speed = 350);
  speedBtn.classList[`${speed === 250 ? "remove" : "add"}`]("speed");
};

const soloModeController = () => {
  vsMode = 1;
  stage = 1;
  mainStage.classList.add("hidden");
  playersNumberInput.value = vsMode;
  setupGameController();

  // REFERENCED
  // inputTextElementController(vsMode);
  // inputRangeElementController(vsMode);
  // stageSwitcher();
};
const vsCpuModeController = () => {
  vsMode = 2;
  stage = 1;
  mainStage.classList.add("hidden");
  playersNumberInput.value = vsMode;
  setupGameController();
  // REFERENCED
  // inputTextElementController(vsMode);
  // inputRangeElementController(vsMode);
  // stageSwitcher();
};
const vsPlayersModeController = () => {
  vsMode = 3;
  mainStage.classList.add("hidden");
  stageSwitcher();
};
const newGameController = () => {
  if (!game) {
    vsMode = active = stage = interval = 0;
    speed = 500;
    playersNumberInput.value = 0;
    players.length = 0;
    document
      .querySelectorAll(".name-wrapper")
      .forEach((input) => input.remove());
    document
      .querySelectorAll(".color-wrapper")
      .forEach((wrapper) => wrapper.remove());
    document
      .querySelectorAll(".pointer-placeholder")
      .forEach((wrapper) => wrapper.remove());
    mainStage.classList.toggle("hidden");
    document.querySelector(".game-setup").classList.toggle("hidden");
    stages.forEach((stage) => stage.classList.add("hidden"));
  }
};
const replayController = () => {
  if (!game) {
    game = true;
    active = 0;
    speed = 500;
    players.forEach((player, i) => {
      player.score = 0;
      player.prevScore = 0;
      player.pointer.classList.remove("active");
      document
        .querySelectorAll(`.pointer-placeholder`)
        [i].append(player.pointer);
      startBtn.textContent = "Start";
    });
    message.classList.toggle("hidden");
  }
};
const resetGameController = () => {
  if (!game) {
    game = true;
    active = 0;
    speed = 500;
    players.forEach((player, i) => {
      player.score = 0;
      player.prevScore = 0;
      player.pointer.classList.remove("active");
      document
        .querySelectorAll(`.pointer-placeholder`)
        [i].append(player.pointer);
      startBtn.textContent = "Start";
    });
  }
};
const gameOptionsMenuController = () => {
  gameOptionsMenu.classList.toggle("hidden");
};
soloBtn.addEventListener("click", soloModeController);
vsCpuBtn.addEventListener("click", vsCpuModeController);
vsPlayersBtn.addEventListener("click", vsPlayersModeController);
playersColorSetupContainer.addEventListener("change", playerColorSetter);
setupBtn.addEventListener("click", setupGameController);
nextBtn.addEventListener("click", stageSwitcherController);
themeBtn.addEventListener("click", themeSwitcherController);
speedBtn.addEventListener("click", roundSpeedController);
primaryLogo.addEventListener("click", gameOptionsMenuController);
newGameBtn.addEventListener("click", newGameController);
resetGameBtn.addEventListener("click", resetGameController);
messageReplay.addEventListener("click", replayController);
startBtn.addEventListener("click", () => {
  game = true;
  engine();

  if (vsMode === 2) {
    setTimeout(engine, (interval += 1000));
  }
});

pointersContainer.addEventListener("click", (e) => {
  if (!players[selections].pointer) {
    const id = e.target.id.split("-")[1];
    charactersPointers[+id].isSelected = true;
    players[selections].pointer = e.target;
    players[selections].pointer.className = `pointer pointer-${
      +id + 1
    } pointer-right`;
    playerPointerSelectController();
    selections === players.length - 1 ? playersPointersGenerator() : false;
    (selections < players.length - 1 && players.length) > 1
      ? selections++
      : false;
  }
});
playerPointerSelectController();

