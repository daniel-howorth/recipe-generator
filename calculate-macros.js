const macroTargetsCard = document.querySelector(".macro-targets");
const getTargetsBtn = document.querySelector(".search-btn");
const gender = document.querySelector("#genderInput");
const weight = document.querySelector("#weightInput");
const height = document.querySelector("#heightInput");
const age = document.querySelector("#ageInput");
const activityLevel = document.querySelector("#activityLevelInput");
const fitnessGoal = document.querySelector("#fitnessGoalInput");

getTargetsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const targets = getTargets();
  // console.log(targets);
  displayMacroTargets(targets);
});

function getTargets() {
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
