import "../css/main.css";
import "../css/profile.css";
import "../css/modal-styles.css";

import firebase from "./firebase-config.js";
import { signOutUser, deleteUserAccount } from "./auth";
import { getModal, displayModalWithContent } from "./modal.js";

const emailAddressValue = document.querySelector("#email-address-value");
const deleteAccountBtn = document.querySelector("#delete-btn");
const modalContent = document.querySelector(".modal-content");
const container = document.querySelector("#modal");
const modal = getModal(container);

const mobileMenuBtn = document.querySelector("#mobile-menu-btn");
const mobileMenuContainer = document.querySelector("#mobile-menu-modal");
const mobileMenuModal = getModal(mobileMenuContainer);
mobileMenuBtn.addEventListener("click", () => mobileMenuModal.show());

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("current user:", user.uid);
    emailAddressValue.textContent = user.email;
  } else {
    window.location.href = "index.html";
  }
});

const logoutBtns = document.querySelectorAll(".logout");
logoutBtns.forEach((btn) => btn.addEventListener("click", signOutUser));

function confirmAccountDeletion() {
  const confirmContent = document.createElement("div");
  confirmContent.setAttribute("class", "confirm-modal");
  confirmContent.innerHTML = `
    <div class="confirm-modal">
      <span>Are you sure you want to delete your account?</span>
      <div class="confirm-modal-action-buttons">
        <button class="confirm-btn">Yes</button
        ><button class="cancel-btn">Cancel</button>
      </div>
    </div>`;

  confirmContent
    .querySelector(".confirm-btn")
    .addEventListener("click", deleteUserAccount);
  confirmContent.querySelector(".cancel-btn").addEventListener("click", () => {
    modal.hide();
  });

  displayModalWithContent(confirmContent, modalContent, modal);
}

deleteAccountBtn.addEventListener("click", confirmAccountDeletion);
