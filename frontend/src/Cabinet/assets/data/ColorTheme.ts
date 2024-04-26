import { createGlobalStyle, css } from "styled-components";

const lightValues = css`
  --bg-color: var(--white);
  --line-color: var(--shared-gray-color-400);
  --normal-text-color: var(--black);
  --white-text-with-bg-color: var(--white);
  --card-content-bg-color: var(--white);
  --button-line-color: var(--default-main-color);
  --capsule-btn-border-color: var(--gray-200);
  --capsule-btn-hover-bg-color: var(--transparent-purple);
  --presentation-no-event-past-color: var(--gray-200);
  --presentation-no-event-cur-color: var(--bg-color);

  /* main color variable */
  --main-color: var(--purple-500);
  --sub-color: var(--purple-300);

  --default-main-color: var(--purple-500);
  --default-sub-color: var(--purple-300);
  --default-mine-color: var(--green-100);

  --presentation-main-color: var(--blue-400);
  --presentation-sub-color: var(--blue-160);

  /* cabinet color variable */
  --mine-color: var(--green-100);
  --available-color: var(--main-color);
  --pending-color: var(--main-color);
  --full-color: var(--gray-200);
  --expired-color: var(--red-100);
  --banned-color: var(--gray-600);

  --bg-shadow-color-100: var(--black-shadow-100);
  --bg-shadow-color-200: var(--black-shadow-200);
  --bg-shadow-color-300: var(--black-shadow-300);
  --bg-shadow-color-400: var(--black-shadow-400);
  --border-shadow-color-100: var(--black-shadow-100);
  --border-shadow-color-200: var(--black-shadow-200);
  --border-shadow-color-300: var(--black-shadow-300);
  --table-border-shadow-color: var(--black-shadow-100);
  /* TODO : table에 다 적용 */
  --shared-gray-color-100: var(--gray-100);
  --shared-gray-color-200: var(--gray-200);
  --shared-gray-color-300: var(--gray-300);
  --shared-gray-color-400: var(--gray-400);
  --shared-gray-color-450: var(--gray-450);
  --shared-gray-color-500: var(--gray-500);
  --shared-gray-color-600: var(--gray-600);
  --shared-gray-color-700: var(--gray-800);

  --shared-purple-color-100: var(--purple-100);

  --shared-blue-color-100: var(--blue-100);
  --shared-blue-color-200: var(--blue-150);
  --shared-blue-color-300: var(--blue-250);

  color: var(--normal-text-color);
  background-color: var(--bg-color);
`;

// set up dark theme CSS variables
const darkValues = css`
  --bg-color: var(--gray-900);
  --line-color: var(--shared-gray-color-300);
  --normal-text-color: var(--gray-100);
  --white-text-with-bg-color: var(--gray-100);
  --card-content-bg-color: var(--gray-550);
  --button-line-color: var(--default-sub-color);
  --capsule-btn-border-color: var(--gray-600);
  --capsule-btn-hover-bg-color: var(--transparent-purple);
  --presentation-no-event-past-color: var(--bg-color);
  --presentation-no-event-cur-color: var(--gray-600);

  --main-color: var(--purple-600);
  --sub-color: var(--purple-300);

  --default-main-color: var(--purple-600);
  --default-sub-color: var(--purple-300);
  --default-mine-color: var(--green-200);

  --presentation-main-color: var(--blue-400);
  --presentation-sub-color: var(--blue-160);

  --mine-color: var(--green-200);
  --available-color: var(--main-color);
  --pending-color: var(--main-color);
  --full-color: var(--gray-200);
  --expired-color: var(--red-200);
  --banned-color: var(--gray-600);

  --bg-shadow-color-100: var(--black-shadow-200);
  --bg-shadow-color-200: var(--black-shadow-300);
  --bg-shadow-color-300: var(--black-shadow-400);
  --bg-shadow-color-400: var(--black-shadow-400);
  --border-shadow-color-100: var(--black-shadow-200);
  --border-shadow-color-200: var(--black-shadow-300);
  --border-shadow-color-300: var(--black-shadow-400);
  --table-border-shadow-color: var(--black-shadow-400);

  --shared-gray-color-100: var(--gray-700);
  --shared-gray-color-200: var(--gray-700);
  --shared-gray-color-300: var(--gray-600);
  --shared-gray-color-450: var(--gray-450);
  --shared-gray-color-400: var(--gray-500);
  --shared-gray-color-500: var(--gray-400);
  --shared-gray-color-600: var(--gray-300);
  --shared-gray-color-700: var(--gray-200);

  --shared-purple-color-100: var(--purple-700);

  --shared-blue-color-100: var(--blue-500);
  --shared-blue-color-200: var(--blue-150);
  --shared-blue-color-300: var(--blue-250);

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
