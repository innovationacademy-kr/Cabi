import styled from "styled-components";
import LeftMainNavContainer from "@/Presentation_legacy/components/LeftNav/LeftMainNav/LeftMainNav.container";

const LeftNav: React.FC<{
  isVisible: boolean;
  isAdmin?: boolean;
}> = ({ isAdmin, isVisible }) => {
  return (
    <LeftNavWrapStyled id="leftNavWrap">
      <LeftMainNavContainer isAdmin={isAdmin} />
    </LeftNavWrapStyled>
  );
};

const LeftNavWrapStyled = styled.div`
  display: flex;
`;

export default LeftNav;
