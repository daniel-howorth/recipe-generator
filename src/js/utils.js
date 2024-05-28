export function isNumber(value) {
  return typeof value === "number";
}

export function validateInput(inputs) {
  let validStates = []; // array of true and false flags

  inputs.forEach((input) => {
    // reset invalid styles first
    input.classList.remove("invalidInput");
    document
      .querySelector(`#${input.id} + .invalid-label`)
      .classList.add("hidden");

    if (input.value) {
      // test numeric inputs
      if (input.classList.contains("number-input")) {
        if (/^\d+(\.\d+)?$/.test(input.value)) {
          validStates.push(true);
        } else {
          validStates.push(false);
          input.classList.add("invalidInput");
          document
            .querySelector(`#${input.id} + .invalid-label`)
            .classList.remove("hidden");
        }
      } else {
        // test text inputs
        if (/^\w+(,\s?\w+)*$/.test(input.value)) {
          validStates.push(true);
        } else {
          validStates.push(false);
          input.classList.add("invalidInput");
          document
            .querySelector(`#${input.id} + .invalid-label`)
            .classList.remove("hidden");
        }
      }
    }
  });

  return validStates.every((state) => state);
}
