import styled from "styled-components";

interface CabinetListInterface {
  colNum: number;
}

const CabinetListContainer = ({
  colNum,
}: CabinetListInterface): JSX.Element => {
  return (
    <CabinetListContainerStyled colNum={colNum}></CabinetListContainerStyled>
  );
};

const CabinetListContainerStyled = styled.div`
  display: flex;
  width: ${({ colNum }: CabinetListInterface) => colNum * 90 - 10}px;
`;

export default CabinetListContainer;
