import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import { CardContentWrapper } from "@/Cabinet/components/Card/CardStyles";
import DisplayStyle from "@/Cabinet/components/Card/DisplayStyleCard/DisplayStyle";
import { DisplayStyleToggleType } from "@/Cabinet/types/enum/displayStyle.type.enum";

interface DisplayStyleProps {
  displayStyleToggle: DisplayStyleToggleType;
  handleDisplayStyleButtonClick: (DisplayStyleToggleType: string) => void;
}

const DisplayStyleCard = ({
  displayStyleToggle,
  handleDisplayStyleButtonClick,
}: DisplayStyleProps) => {
  return (
    <>
      <DisplayStyleCardWrapper>
        <Card
          title={"화면 스타일"}
          gridArea={"displayStyle"}
          width={"350px"}
          height={"183px"}
        >
          <>
            <CardContentWrapper>
              <DisplayStyle
                displayStyleToggle={displayStyleToggle}
                handleDisplayStyleButtonClick={handleDisplayStyleButtonClick}
              />
            </CardContentWrapper>
          </>
        </Card>
      </DisplayStyleCardWrapper>
    </>
  );
};

const DisplayStyleCardWrapper = styled.div`
  z-index: 1;
  align-self: start;
`;

export default DisplayStyleCard;
