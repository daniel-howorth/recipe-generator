import { validateInput } from "./utils.js";
import firebase from "./index.js";
import { signOutUser } from "./auth.js";

const macroTargetsCard = document.querySelector(".macro-targets");
const getTargetsBtn = document.querySelector(".search-btn");
const gender = document.querySelector("#genderInput");
const weight = document.querySelector("#weightInput");
const height = document.querySelector("#heightInput");
const age = document.querySelector("#ageInput");
const activityLevel = document.querySelector("#activityLevelInput");
const fitnessGoal = document.querySelector("#fitnessGoalInput");
const unpopulatedInputsMsg = document.querySelector(".unpopulatedInputsMsg");

getTargetsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const allInputs = document.querySelectorAll("form input");
  const allInputsPopulated = checkInputsPopulated(allInputs);
  let inputIsValid = false;
  if (allInputsPopulated) {
    inputIsValid = validateInput(allInputs);
  }
  if (inputIsValid) {
    const targets = getTargets();
    displayMacroTargets(targets);
  }
});

function checkInputsPopulated(allInputs) {
  // convert nodelist to array
  const allInputsArray = [...allInputs];
  const allInputsPopulated = allInputsArray.every((input) => input.value);
  allInputsPopulated
    ? unpopulatedInputsMsg.classList.add("hidden")
    : unpopulatedInputsMsg.classList.remove("hidden");
  return allInputsPopulated;
}

function getTargets() {
  // if data doesn't exist, return early.
  if (!gender.value || !weight.value || !height.value || !age.value) {
    return 0;
  }

  const bmr = getBMR(gender.value, weight.value, height.value, age.value);

  const tdee = getTDEE(bmr, activityLevel.value);

  const calorieTarget = getCalorieTarget(tdee, fitnessGoal.value);

  const [proteinTarget, fatTarget, carbsTarget] = getMacroTargets(
    weight.value,
    calorieTarget,
    fitnessGoal
  );

  return {
    calorieTarget: calorieTarget,
    proteinTarget: proteinTarget,
    fatTarget: fatTarget,
    carbsTarget: carbsTarget,
  };
}

// returns basal metabolic rate
function getBMR(gender, weight, height, age) {
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  return gender === "male" ? bmr + 5 : bmr - 161;
}

// returns total daily energy expenditure
function getTDEE(bmr, activityLevel) {
  switch (activityLevel) {
    case "sedentary":
      return bmr * 1.2;
    case "lightly-active":
      return bmr * 1.375;
    case "moderately-active":
      return bmr * 1.55;
    case "very-active":
      return bmr * 1.725;
    case "super-active":
      return bmr * 1.9;
  }
}

// returns daily calorie target based on fitness goals
function getCalorieTarget(tdee, fitnessGoal) {
  switch (fitnessGoal) {
    case "weight-loss":
      return tdee - 300;
    case "weight-gain":
      return tdee + 300;
    default:
      return tdee;
  }
}

// returns protein, fat, and carbs targets in grams.
function getMacroTargets(weight, calorieTarget, fitnessGoal) {
  const proteinMultiplier = fitnessGoal === "maintenance" ? 1.5 : 1.8;
  const proteinTarget = weight * proteinMultiplier;
  const fatTarget = (calorieTarget * 0.25) / 9;
  const carbsTarget = (calorieTarget - (proteinTarget * 4 + fatTarget * 9)) / 4;
  return [proteinTarget, fatTarget, carbsTarget];
}

function displayMacroTargets(data) {
  // if data doesn't exist, return early.
  if (!data) {
    return 0;
  }

  while (macroTargetsCard.firstChild) {
    macroTargetsCard.removeChild(macroTargetsCard.firstChild);
  }

  const macroTargetsHTML = `
    <h2>Daily Macro Targets</h2>
    <div class="macro-target">
      <span>Calories</span>
      <span>${Math.round(data.calorieTarget)} kcal</span>
    </div>
    <div class="macro-target">
      <span>Protein</span>
      <span>${Math.round(data.proteinTarget)}g</span>
    </div>
    <div class="macro-target">
      <span>Carbs</span>
      <span>${Math.round(data.carbsTarget)}g</span>
    </div>
    <div class="macro-target">
      <span>Fat</span>
      <span>${Math.round(data.fatTarget)}g</span>
    </div>
  `;

  macroTargetsCard.innerHTML = macroTargetsHTML;
  document.querySelector(".macro-targets-wrapper").classList.remove("hidden");
  macroTargetsCard.scrollIntoView({ behavior: "smooth" });
}

const logoutBtns = document.querySelectorAll(".logout");
logoutBtns.forEach((btn) => btn.addEventListener("click", signOutUser));
