import A11yDialog from "a11y-dialog";

export const getModal = (container) => {
  return new A11yDialog(container);
};

export const displayModalWithContent = (content, modalContent, modal) => {
  while (modalContent.firstChild) {
    modalContent.removeChild(modalContent.firstChild);
  }

  modalContent.appendChild(content);

  modal.show();
};
