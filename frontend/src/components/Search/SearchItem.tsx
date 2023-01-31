import styled from "styled-components";

const SearchItem = () => (
  <WrapperStyled className="cabiButton">
    <RectangleStyled color="var(--main-color)">42</RectangleStyled>
    <TextWrapper>
      <LocationStyled>2층 - Oasis</LocationStyled>
      <NameWrapperStyled>
        <IconStyled src="/src/assets/images/clubIcon.svg" alt="" />
        <NameStyled>42cabi, seycho, yooh</NameStyled>
      </NameWrapperStyled>
    </TextWrapper>
  </WrapperStyled>
);

const WrapperStyled = styled.div`
  width: 350px;
  height: 110px;
  border-radius: 10px;
  padding: 25px;
  background-color: var(--lightgary-color);
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    outline: 2px solid var(--main-color);
  }
`;

const RectangleStyled = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-color: ${(props) => props.color};
  font-size: 32px;
  color: var(--white);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const LocationStyled = styled.p`
  font-size: 14px;
  line-height: 28px;
  color: var(--gray-color);
`;

const NameWrapperStyled = styled.div`
  line-height: 28px;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const IconStyled = styled.img`
  width: 24px;
  height: 24px;
`;

const NameStyled = styled.span`
  line-height: 28px;
  font-size: 14px;
  margin-left: 4px;
`;

export default SearchItem;
