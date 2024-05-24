const getTargetsBtn = document.querySelector(".search-btn");

getTargetsBtn.addEventListener("click", (e) => {
  // e.preventDefault();
  // const targets = getTargets();
});

function getTargets() {}

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

// let bmr = getBMR("male", 100, 183, 27);
// let tdee = getTDEE(bmr, "sedentary");
// let calorieTarget = getCalorieTarget(tdee, "weight-loss");
// console.log(Math.round(calorieTarget));
// let macroTargets = getMacroTargets(100, calorieTarget, "weight-loss");
// console.log(macroTargets);
