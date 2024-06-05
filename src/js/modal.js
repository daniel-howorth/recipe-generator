import A11yDialog from "a11y-dialog";

export const getModal = (container) => {
  return new A11yDialog(container);
};

export const displayModalWithContent = (content, contentWrapper, modal) => {
  while (contentWrapper.firstChild) {
    contentWrapper.removeChild(contentWrapper.firstChild);
  }

  content.classList.add("modal-content");
  content.setAttribute("role", "document");
  contentWrapper.appendChild(content);

  modal.show();
};
