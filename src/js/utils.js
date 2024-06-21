import chevronUpIcon from "../assets/chevron-up.svg";
import chevronDownIcon from "../assets/chevron-down.svg";

export function isNumber(value) {
  return typeof value === "number";
}

export function formatInput(input) {
  return input.trim().split(" ").join("");
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

export function applyToggleContentEventListeners() {
  document
    .querySelectorAll(".toggle-content-btn")
    .forEach((button) => button.addEventListener("click", toggleContent));
}

function toggleContent() {
  const content = document.querySelector(`#${this.dataset.toggle}`);
  const toggleIcon = this.querySelector("img");

  if (toggleIcon.getAttribute("src").includes(chevronDownIcon)) {
    toggleIcon.setAttribute("src", chevronUpIcon);
  } else {
    toggleIcon.setAttribute("src", chevronDownIcon);
  }

  content.classList.toggle("hidden");
}
