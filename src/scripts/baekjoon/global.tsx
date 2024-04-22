import React from "react";
import { createRoot } from "react-dom/client";
import { SolveButton } from "./solve/components/SolveButton";
import { getProblemId } from "./utils";

const customGlobalPage = (): void => {
  const addSolveButton = () => {
    const submitButton = document.querySelector(
      'ul.problem-menu li a[href*="/submit"]'
    );

    if (submitButton) {
      const submitListItem = submitButton.closest("li");

      if (submitListItem) {
        const problemId: string | null = getProblemId();
        const listItem = document.createElement("li");

        submitListItem.parentNode?.insertBefore(
          listItem,
          submitListItem.nextSibling
        );

        const root = createRoot(listItem);
        root.render(<SolveButton problemId={problemId} />);
      }
    }
  };

  addSolveButton();
};

export default customGlobalPage;
