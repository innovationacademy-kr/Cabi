import { createGlobalStyle, css } from "styled-components";

const lightValues = css`
  --bg-color: var(--ref-white);
  --line-color: var(--shared-gray-color-400);
  --normal-text-color: var(--ref-black);
  --white-text-with-bg-color: var(--ref-white);
  --card-content-bg-color: var(--ref-white);
  --button-line-color: var(--sys-main-color);
  --capsule-btn-border-color: var(--ref-gray-200);
  --capsule-btn-hover-bg-color: var(--ref-transparent-purple-100);
  --presentation-no-event-past-color: var(--ref-gray-200);
  --presentation-no-event-cur-color: var(--bg-color);
  --color-picker-bg-color: var(--bg-color);
  --color-picker-hash-bg-color: var(--ref-gray-200);
  --color-picker-hash-color: var(--ref-gray-450);
  --color-picker-input-color: var(--ref-gray-500);

  /* main color variable */
  --sys-main-color: var(--ref-purple-500);
  --sys-sub-color: var(--ref-purple-300);

  --sys-default-main-color: var(--ref-purple-500);
  --sys-default-sub-color: var(--ref-purple-300);
  --sys-default-mine-color: var(--ref-green-100);

  --sys-presentation-main-color: var(--ref-blue-400);
  --sys-presentation-sub-color: var(--ref-blue-160);

  /* cabinet color variable */
  --mine-color: var(--ref-green-100);
  --available-color: var(--sys-main-color);
  --pending-color: var(--sys-main-color);
  --full-color: var(--ref-gray-200);
  --expired-color: var(--ref-red-100);
  --banned-color: var(--ref-gray-600);

  --modal-bg-shadow-color: var(--ref-black-shadow-200);
  --hover-box-shadow-color: var(--ref-black-shadow-300);
  --tooltip-shadow-color: var(--ref-black-shadow-400);
  --login-card-border-shadow-color: var(--ref-black-shadow-200);
  --table-border-shadow-color-100: var(--ref-black-shadow-100);
  --table-border-shadow-color-200: var(--ref-black-shadow-100);
  --menu-bg-shadow-color: var(--ref-black-shadow-100);
  --color-picker-border-shadow-color: var(--ref-black-shadow-200);
  --left-nav-border-shadow-color: var(--ref-black-shadow-200);
  --page-btn-shadow-color: var(--ref-black-shadow-300);

  --custom-purple-200: var(--sys-default-main-color);

  --card-bg-color: var(--ref-gray-100);
  --map-floor-color: var(--ref-gray-200);
  --service-man-title-border-btm-color: var(--ref-gray-300);
  --shared-gray-color-400: var(--ref-gray-400);
  --presentation-card-speaker-name-color: var(--ref-gray-450);
  --gray-line-btn-color: var(--ref-gray-500);
  --pie-chart-label-text-color: var(--ref-gray-600);
  --notion-btn-text-color: var(--ref-gray-800);

  --table-even-row-bg-color: var(--ref-purple-100);

  --presentation-table-even-row-bg-color: var(--ref-blue-100);
  --presentation-detail-available-color: var(--ref-blue-150);
  --presentation-dropdown-select-color: var(--ref-blue-470);
  --presentation-blue-pagination-btn-color: var(--ref-blue-250);

  color: var(--normal-text-color);
  background-color: var(--bg-color);
`;

// set up dark theme CSS variables
const darkValues = css`
  --bg-color: var(--ref-gray-900);
  --line-color: var(--service-man-title-border-btm-color);
  --normal-text-color: var(--ref-gray-100);
  --white-text-with-bg-color: var(--ref-gray-100);
  --card-content-bg-color: var(--ref-gray-550);
  --button-line-color: var(--sys-main-color);
  --capsule-btn-border-color: var(--ref-gray-600);
  --capsule-btn-hover-bg-color: var(--ref-transparent-purple-200);
  --presentation-no-event-past-color: var(--bg-color);
  --presentation-no-event-cur-color: var(--ref-gray-600);
  --color-picker-bg-color: var(--ref-gray-530);
  --color-picker-hash-bg-color: var(--ref-gray-550);
  --color-picker-hash-color: var(--ref-gray-450);
  --color-picker-input-color: var(--ref-gray-400);

  --sys-main-color: var(--ref-purple-600);
  --sys-sub-color: var(--ref-purple-300);

  --sys-default-main-color: var(--ref-purple-600);
  --sys-default-sub-color: var(--ref-purple-300);
  --sys-default-mine-color: var(--ref-green-200);

  --sys-presentation-main-color: var(--ref-blue-430);
  --sys-presentation-sub-color: var(--ref-blue-160);

  --mine-color: var(--ref-green-200);
  --available-color: var(--sys-main-color);
  --pending-color: var(--sys-main-color);
  --full-color: var(--ref-gray-200);
  --expired-color: var(--ref-red-200);
  --banned-color: var(--ref-gray-600);

  --modal-bg-shadow-color: var(--ref-black-shadow-300);
  --hover-box-shadow-color: var(--ref-black-shadow-400);
  --tooltip-shadow-color: var(--ref-black-shadow-400);
  --login-card-border-shadow-color: var(--ref-black-shadow-300);
  --table-border-shadow-color-100: var(--ref-black-shadow-300);
  --table-border-shadow-color-200: var(--ref-black-shadow-400);
  --menu-bg-shadow-color: var(--ref-black-shadow-300);
  --color-picker-border-shadow-color: var(--ref-black-shadow-200);
  --left-nav-border-shadow-color: var(--ref-black-shadow-400);
  --page-btn-shadow-color: var(--ref-black-shadow-400);

  --custom-purple-200: var(--ref-purple-600);

  --card-bg-color: var(--ref-gray-700);
  --map-floor-color: var(--ref-gray-700);
  --service-man-title-border-btm-color: var(--ref-gray-600);
  --presentation-card-speaker-name-color: var(--ref-gray-450);
  --shared-gray-color-400: var(--ref-gray-500);
  --gray-line-btn-color: var(--ref-gray-400);
  --pie-chart-label-text-color: var(--ref-gray-300);
  --notion-btn-text-color: var(--ref-gray-200);

  --table-even-row-bg-color: var(--ref-purple-700);

  --presentation-table-even-row-bg-color: var(--ref-blue-500);
  --presentation-detail-available-color: var(--ref-blue-150);
  --presentation-dropdown-select-color: var(--ref-blue-470);
  --presentation-blue-pagination-btn-color: var(--ref-blue-250);

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
