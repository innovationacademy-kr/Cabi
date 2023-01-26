import styled from "styled-components";

const SearchList = ({
  isVisible,
  searchList,
}: {
  isVisible: boolean;
  searchList: any[];
}) => {
  return (
    <UlStyled isVisible={isVisible}>
      {searchList.map((item) => {
        return <LiStyled>{item.intra_id}</LiStyled>;
      })}
    </UlStyled>
  );
};

const UlStyled = styled.ul<{ isVisible: boolean }>`
  display: ${(props) => (props.isVisible ? "block" : "none")};
  position: absolute;
  top: 50px;
  left: 0;
  width: 300px;
  border: 1px solid var(--white);
  border-radius: 10px;
  text-align: left;
  padding: 10px;
  color: var(--black);
  background-color: var(--white);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  opacity: 0.9;
  overflow: hidden;
`;

const LiStyled = styled.li`
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--main-color);
      color: var(--white);
    }
  }
`;

export default SearchList;
