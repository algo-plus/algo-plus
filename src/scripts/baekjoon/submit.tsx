import React from "react";
import ReactDOM from "react-dom";
import { SplitView } from "./solve/components/SplitView";

export default function customSubmitPage(): void {
  const addSplitView = () => {
    const root = document.createElement("div");
    document.body.appendChild(root);

    const splitView = (
      <SplitView
        left={{ type: "Problem", data: "1000" }}
        right={{ type: "Editor" }}
      />
    );
    ReactDOM.render(splitView, root);
  };

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
        addSplitView();
      }
    }
  };

  checkActiveState();
}
