import { createGlobalStyle, css } from "styled-components";

const lightValues = css`
  /* system variable */
  --sys-main-color: var(--ref-purple-500);
  --sys-default-main-color: var(--ref-purple-500);
  --sys-default-mine-color: var(--ref-green-100);
  --sys-presentation-main-color: var(--ref-blue-600);

  /* component variable */
  --white-text-with-bg-color: var(--ref-white);
  --card-content-bg-color: var(--ref-white);
  --bg-color: var(--ref-white);
  --card-bg-color: var(--ref-gray-100);
  --color-picker-hash-bg-color: var(--ref-gray-200);
  --capsule-btn-border-color: var(--ref-gray-200);
  --map-floor-color: var(--ref-gray-200);
  --presentation-no-event-past-color: var(--ref-gray-200);
  --agu-form-input-border-color: var(--ref-gray-200);
  --inventory-item-title-border-btm-color: var(--ref-gray-300);
  --service-man-title-border-btm-color: var(--ref-gray-300);
  --line-color: var(--ref-gray-400);
  --light-gray-line-btn-color: var(--ref-gray-400);
  --gray-line-btn-color: var(--ref-gray-500);
  --pie-chart-label-text-color: var(--ref-gray-700);
  --notion-btn-text-color: var(--ref-gray-900);
  --normal-text-color: var(--ref-black);

  --button-line-color: var(--sys-main-color);
  --capsule-btn-hover-bg-color: var(--ref-transparent-purple-100);
  --presentation-no-event-cur-color: var(--bg-color);
  --color-picker-bg-color: var(--bg-color);
  --extension-card-active-btn-color: var(--sys-main-color);
  --presentation-card-speaker-name-color: var(--ref-gray-500);
  --presentation-card-sub-title-color: var(--ref-gray-800);
  --table-even-row-bg-color: var(--ref-purple-100);
  --presentation-table-even-row-bg-color: var(--ref-blue-100);
  --presentation-dropdown-select-color: var(--ref-blue-200);
  --color-picker-hash-color: var(--ref-gray-400);

  /* cabinet */
  --mine-color: var(--ref-green-100);
  --available-color: var(--sys-main-color);
  --pending-color: var(--sys-main-color);
  --expired-color: var(--ref-red-100);

  /* shadow */
  --modal-bg-shadow-color: var(--ref-black-shadow-200);
  --hover-box-shadow-color: var(--ref-black-shadow-300);
  --login-card-border-shadow-color: var(--ref-black-shadow-200);
  --table-border-shadow-color-100: var(--ref-black-shadow-100);
  --table-border-shadow-color-200: var(--ref-black-shadow-100);
  --menu-bg-shadow-color: var(--ref-black-shadow-100);
  --left-nav-border-shadow-color: var(--ref-black-shadow-200);
  --page-btn-shadow-color: var(--ref-black-shadow-300);

  /* social oauth brand color */
  --github-bg-color: var(--ref-blue-900);

  color: var(--normal-text-color);
  background-color: var(--bg-color);
`;

// 다크모드 변수
const darkValues = css`
  /* system variable */
  --sys-main-color: var(--ref-purple-600);
  --sys-default-main-color: var(--ref-purple-600);
  --sys-default-mine-color: var(--ref-green-200);
  --sys-presentation-main-color: var(--ref-blue-700);

  /* component variable */
  --white-text-with-bg-color: var(--ref-gray-100);
  --card-content-bg-color: var(--ref-gray-700);
  --bg-color: var(--ref-gray-900);
  --card-bg-color: var(--ref-gray-800);
  --color-picker-hash-bg-color: var(--ref-gray-700);
  --capsule-btn-border-color: var(--ref-gray-700);
  --map-floor-color: var(--ref-gray-800);
  --presentation-no-event-past-color: var(--ref-gray-900);
  --agu-form-input-border-color: var(--ref-gray-500);
  --inventory-item-title-border-btm-color: var(--ref-gray-500);
  --line-color: var(--ref-gray-500);
  --service-man-title-border-btm-color: var(--ref-gray-700);
  --light-gray-line-btn-color: var(--ref-gray-700);
  --gray-line-btn-color: var(--ref-gray-400);
  --pie-chart-label-text-color: var(--ref-gray-300);
  --notion-btn-text-color: var(--ref-gray-200);
  --normal-text-color: var(--ref-gray-100);

  --button-line-color: var(--sys-main-color);
  --capsule-btn-hover-bg-color: var(--ref-transparent-purple-200);
  --presentation-no-event-cur-color: var(--ref-gray-700);
  --color-picker-bg-color: var(--ref-gray-600);
  --extension-card-active-btn-color: var(--gray-line-btn-color);
  --presentation-card-speaker-name-color: var(--ref-gray-400);
  --presentation-card-sub-title-color: var(--ref-gray-300);
  --table-even-row-bg-color: var(--ref-purple-900);
  --presentation-table-even-row-bg-color: var(--ref-blue-900);
  --presentation-dropdown-select-color: var(--ref-blue-800);
  --color-picker-hash-color: var(--ref-gray-500);

  /* cabinet */
  --mine-color: var(--ref-green-200);
  --available-color: var(--sys-main-color);
  --pending-color: var(--sys-main-color);
  --expired-color: var(--ref-red-200);

  /* shadow */
  --modal-bg-shadow-color: var(--ref-black-shadow-300);
  --hover-box-shadow-color: var(--ref-black-shadow-400);
  --login-card-border-shadow-color: var(--ref-black-shadow-300);
  --table-border-shadow-color-100: var(--ref-black-shadow-300);
  --table-border-shadow-color-200: var(--ref-black-shadow-400);
  --menu-bg-shadow-color: var(--ref-black-shadow-300);
  --left-nav-border-shadow-color: var(--ref-black-shadow-400);
  --page-btn-shadow-color: var(--ref-black-shadow-400);

  /* social oauth brand color */

  color: var(--normal-text-color);
  background-color: var(--bg-color);
`;

export const GlobalStyle = createGlobalStyle`
  :root {
      ${lightValues}
    [display-style="DARK"] {
      ${darkValues}
    }
  }
  `;
