const customStatusPage = (): void => {
  const url: string = window.location.pathname;
  

  console.log("custom status page...");

  // Find the table in the DOM
  const table = document.getElementById("status-table");

  if (!table) return;
  const tableHead = table.querySelector("thead");
  if (!tableHead) return;
  const tableBody = table.querySelector("tbody");
  if (!tableBody) return;

  const column = tableHead.getElementsByTagName("tr");

  const headerCell = document.createElement("th");
  headerCell.textContent = "오답";
  headerCell.style.width = "5%";

  column[0].insertBefore(headerCell, column[0].firstChild);

  const rows = tableBody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const checkboxCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkboxCell.appendChild(checkbox);

    row.insertBefore(checkboxCell, row.firstChild);
  }

  const button = document.createElement("button");
  button.textContent = "오답 노트 작성";
  button.classList.add("btn", "btn-primary");
  button.addEventListener("click", () => {
    showModal();
  });

  const anchor = document.getElementsByClassName("text-center");

  if (anchor) {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.appendChild(button);

    anchor[1].insertBefore(container, anchor[1].firstChild);
  }
};

const showModal = () => {
  const modalBackdrop = document.createElement("div");
  modalBackdrop.style.display = "flex";
  modalBackdrop.classList.add("modal-backdrop");

  modalBackdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modalBackdrop.style.position = "fixed";
  modalBackdrop.style.top = "0";
  modalBackdrop.style.left = "0";
  modalBackdrop.style.width = "100%";
  modalBackdrop.style.height = "100%";
  modalBackdrop.style.justifyContent = "center";
  modalBackdrop.style.alignItems = "center";

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.style.backgroundColor = "white";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "10px";
  modalContent.style.width = "500px";
  modalContent.style.maxWidth = "100%";
  modalContent.style.margin = "auto";
  modalContent.style.position = "relative";
  modalContent.style.top = "50%";
  modalContent.style.transform = "translateY(-50%)";
  modalContent.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";

  const modalHeader = document.createElement("div");
  modalHeader.style.display = "flex";
  modalHeader.classList.add("modal-header");
  modalHeader.innerHTML = `
  <h5 class="modal-title">오답 노트 작성</h5>
  `;

  const btnClose = document.createElement("button");
  btnClose.type = "button";
  btnClose.classList.add("close");
  btnClose.id = "btn-close";
  btnClose.setAttribute("data-dismiss", "modal");
  btnClose.setAttribute("aria-label", "Close");

  modalHeader.appendChild(btnClose);

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");
  modalBody.innerHTML = `
    <textarea rows="6" cols="50">
    </textarea>
  `;

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");
  modalFooter.innerHTML = `
  <button type="button" class="btn btn-secondary" data-dismiss="modal">취소</button>
  <button type="button" class="btn btn-primary">저장</button>
  `;

  modalContent.style.position = "absolute";
  modalContent.style.opacity = "1";

  // Append modal elements to the document body
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);
  modalBackdrop.appendChild(modalContent);
  document.body.appendChild(modalBackdrop);

  // Close modal when close button or backdrop is clicked
  modalHeader.querySelector(".close")?.addEventListener("click", () => {
    closeModal();
  });

  modalBackdrop.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) {
      closeModal();
    }
  });
};

const closeModal = () => {
  const modalBackdrop = document.querySelector(".modal-backdrop");
  if (modalBackdrop) {
    modalBackdrop.remove();
  }
};

export default customStatusPage;
