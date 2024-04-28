import { createGlobalStyle, css } from "styled-components";

const lightValues = css`
  --bg-color: var(--ref-white);
  --line-color: var(--shared-gray-color-400);
  --normal-text-color: var(--ref-black);
  --white-text-with-bg-color: var(--ref-white);
  --card-content-bg-color: var(--ref-white);
  --button-line-color: var(--main-color);
  --capsule-btn-border-color: var(--ref-gray-200);
  --capsule-btn-hover-bg-color: var(--ref-transparent-purple);
  --presentation-no-event-past-color: var(--ref-gray-200);
  --presentation-no-event-cur-color: var(--bg-color);
  --color-picker-bg-color: var(--bg-color);
  --color-picker-hash-bg-color: var(--ref-gray-200);
  --color-picker-hash-color: var(--ref-gray-450);
  --color-picker-input-color: var(--ref-gray-500);

  /* main color variable */
  --main-color: var(--ref-purple-500);
  --sub-color: var(--ref-purple-300);

  --default-main-color: var(--ref-purple-500);
  --default-sub-color: var(--ref-purple-300);
  --default-mine-color: var(--ref-green-100);

  --presentation-main-color: var(--ref-blue-400);
  --presentation-sub-color: var(--ref-blue-160);

  /* cabinet color variable */
  --mine-color: var(--ref-green-100);
  --available-color: var(--main-color);
  --pending-color: var(--main-color);
  --full-color: var(--ref-gray-200);
  --expired-color: var(--ref-red-100);
  --banned-color: var(--ref-gray-600);

  --bg-shadow-color-100: var(--ref-black-shadow-100);
  --bg-shadow-color-200: var(--ref-black-shadow-200);
  --bg-shadow-color-300: var(--ref-black-shadow-300);
  --bg-shadow-color-400: var(--ref-black-shadow-400);
  --border-shadow-color-100: var(--ref-black-shadow-100);
  --border-shadow-color-200: var(--ref-black-shadow-200);
  --border-shadow-color-300: var(--ref-black-shadow-300);
  --table-border-shadow-color-100: var(--ref-black-shadow-100);
  --table-border-shadow-color-200: var(--ref-black-shadow-100);
  --menu-bg-shadow-color: var(--ref-black-shadow-100);
  --color-picker-border-shadow-color: var(--ref-black-shadow-200);
  --left-nav-border-shadow-color: var(--ref-black-shadow-200);
  --page-btn-shadow-color: var(--ref-black-shadow-300);

  --custom-purple-200: var(--default-main-color);

  --shared-gray-color-100: var(--ref-gray-100);
  --shared-gray-color-200: var(--ref-gray-200);
  --shared-gray-color-300: var(--ref-gray-300);
  --shared-gray-color-400: var(--ref-gray-400);
  --shared-gray-color-450: var(--ref-gray-450);
  --shared-gray-color-500: var(--ref-gray-500);
  --shared-gray-color-600: var(--ref-gray-600);
  --shared-gray-color-700: var(--ref-gray-800);

  --shared-purple-color-100: var(--ref-purple-100);

  --shared-blue-color-100: var(--ref-blue-100);
  --shared-blue-color-200: var(--ref-blue-150);
  --shared-blue-color-300: var(--ref-blue-250);

  color: var(--normal-text-color);
  background-color: var(--bg-color);
`;

// set up dark theme CSS variables
const darkValues = css`
  --bg-color: var(--ref-gray-900);
  --line-color: var(--shared-gray-color-300);
  --normal-text-color: var(--ref-gray-100);
  --white-text-with-bg-color: var(--ref-gray-100);
  --card-content-bg-color: var(--ref-gray-550);
  --button-line-color: var(--main-color);
  --capsule-btn-border-color: var(--ref-gray-600);
  --capsule-btn-hover-bg-color: var(--ref-transparent-purple);
  --presentation-no-event-past-color: var(--bg-color);
  --presentation-no-event-cur-color: var(--ref-gray-600);
  --color-picker-bg-color: var(--ref-gray-530);
  --color-picker-hash-bg-color: var(--ref-gray-550);
  --color-picker-hash-color: var(--ref-gray-450);
  --color-picker-input-color: var(--ref-gray-400);

  --main-color: var(--ref-purple-600);
  --sub-color: var(--ref-purple-300);

  --default-main-color: var(--ref-purple-600);
  --default-sub-color: var(--ref-purple-300);
  --default-mine-color: var(--ref-green-200);

  --presentation-main-color: var(--ref-blue-400);
  --presentation-sub-color: var(--ref-blue-160);

  --mine-color: var(--ref-green-200);
  --available-color: var(--main-color);
  --pending-color: var(--main-color);
  --full-color: var(--ref-gray-200);
  --expired-color: var(--ref-red-200);
  --banned-color: var(--ref-gray-600);

  --bg-shadow-color-100: var(--ref-black-shadow-200);
  --bg-shadow-color-200: var(--ref-black-shadow-300);
  --bg-shadow-color-300: var(--ref-black-shadow-400);
  --bg-shadow-color-400: var(--ref-black-shadow-400);
  --border-shadow-color-100: var(--ref-black-shadow-200);
  --border-shadow-color-200: var(--ref-black-shadow-300);
  --border-shadow-color-300: var(--ref-black-shadow-400);
  --table-border-shadow-color-100: var(--ref-black-shadow-300);
  --table-border-shadow-color-200: var(--ref-black-shadow-400);
  --menu-bg-shadow-color: var(--ref-black-shadow-300);
  --color-picker-border-shadow-color: var(--ref-black-shadow-200);
  --left-nav-border-shadow-color: var(--ref-black-shadow-400);
  --page-btn-shadow-color: var(--ref-black-shadow-400);

  --custom-purple-200: var(--ref-purple-600);

  --shared-gray-color-100: var(--ref-gray-700);
  --shared-gray-color-200: var(--ref-gray-700);
  --shared-gray-color-300: var(--ref-gray-600);
  --shared-gray-color-450: var(--ref-gray-450);
  --shared-gray-color-400: var(--ref-gray-500);
  --shared-gray-color-500: var(--ref-gray-400);
  --shared-gray-color-600: var(--ref-gray-300);
  --shared-gray-color-700: var(--ref-gray-200);

  --shared-purple-color-100: var(--ref-purple-700);

  --shared-blue-color-100: var(--ref-blue-500);
  --shared-blue-color-200: var(--ref-blue-150);
  --shared-blue-color-300: var(--ref-blue-250);

  color: var(--normal-text-color);
  background-color: var(--bg-color);
`;

export const GlobalStyle = createGlobalStyle`
  :root {
      ${lightValues}
    [color-theme="DARK"] {
      ${darkValues}
    }
  }
  `;
