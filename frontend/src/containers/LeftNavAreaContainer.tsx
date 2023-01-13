import styled from "styled-components";
import LeftNavContainer from "./LeftNavContainer";
import LeftNavOptionContainer from "./LeftNavOptionContainer";
import useLeftNav from "@/hooks/useLeftNav";

const LeftNavAreaContainer: React.FC<{ isVisible: boolean }> = (props) => {
  const { closeLeftNav } = useLeftNav();

  return (
    <>
      <LeftNavBgStyled onClick={closeLeftNav} id="leftNavBg"></LeftNavBgStyled>
      <LeftNavWrapStyled id="leftNavWrap">
        <LeftNavContainer></LeftNavContainer>
        <LeftNavOptionContainer
          isVisible={props.isVisible}
        ></LeftNavOptionContainer>
      </LeftNavWrapStyled>
    </>
  );
};

const LeftNavBgStyled = styled.div`
  display: none;
`;

const LeftNavWrapStyled = styled.div`
  display: flex;
`;

export default LeftNavAreaContainer;
