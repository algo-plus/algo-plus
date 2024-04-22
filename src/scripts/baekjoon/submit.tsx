export default function customSubmitPage(): void {
  const checkActiveState = async () => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("solve") === "true") {
      document
        .querySelectorAll("ul.problem-menu li.active")
        .forEach((activeItem) => {
          activeItem.classList.remove("active");
        });

      const submitButton = document.querySelector(
        'ul.problem-menu li a[href*="/submit"]'
      );
      if (submitButton) {
        const solveButton = submitButton.closest("li")?.nextSibling;
        if (solveButton && solveButton instanceof HTMLLIElement) {
          solveButton.classList.add("active");
        }
      }
    }
  };

  checkActiveState();
}
