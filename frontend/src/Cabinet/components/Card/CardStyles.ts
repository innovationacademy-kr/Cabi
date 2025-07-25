import styled from "styled-components";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";

export const CardContentWrapper = styled.div`
  background-color: var(--card-content-bg-color);
  border-radius: 10px;
  padding: 10px 0;
  margin: 5px 5px 5px 5px;
  width: 90%;
  display: flex;
  flex-direction: column;
`;

export const CardContentStyled = styled.div`
  display: flex;
  height: 32px;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0 5px 0;
  padding: 0 10px 0 10px;
`;

export const ContentInfoStyled = styled.div<{
  isSelected?: boolean;
  selectedColor?: string;
}>`
  display: flex;
  padding: 8px 10px;

  ${(props) =>
    props.isSelected &&
    `
    background-color: ${props.selectedColor};
    color: var(--white-text-with-bg-color);
    border-radius: 8px;
  `}
`;

export const ContentDetailStyled = styled.div<{
  status?: CabinetStatus;
}>`
  color: ${(props) =>
    props.status === CabinetStatus.OVERDUE ? "var(--expired-color)" : ""};
  display: flex;
  margin: 5px 10px 5px 10px;
  font-weight: bold;
`;
