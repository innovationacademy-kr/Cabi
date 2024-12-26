import React from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { displayStyleState } from "@/Cabinet/recoil/atoms";
import Card from "@/Cabinet/components/Card/Card";
import { CardContentWrapper } from "@/Cabinet/components/Card/CardStyles";
import { ReactComponent as MonitorMobileIcon } from "@/Cabinet/assets/images/monitorMobile.svg";
import { ReactComponent as MoonIcon } from "@/Cabinet/assets/images/moon.svg";
import { ReactComponent as SunIcon } from "@/Cabinet/assets/images/sun.svg";
import { DisplayStyleToggleType } from "@/Cabinet/types/enum/displayStyle.type.enum";
import useDisplayStyleToggle from "@/Cabinet/hooks/useDisplayStyleToggle";

interface IToggleItemSeparated {
  name: string;
  key: DisplayStyleToggleType;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const toggleList: IToggleItemSeparated[] = [
  {
    name: "라이트",
    key: DisplayStyleToggleType.LIGHT,
    icon: SunIcon,
  },
  {
    name: "다크",
    key: DisplayStyleToggleType.DARK,
    icon: MoonIcon,
  },
  {
    name: "기기설정",
    key: DisplayStyleToggleType.DEVICE,
    icon: MonitorMobileIcon,
  },
];

export const updateLocalStorageDisplayStyleToggle = (
  toggleType: DisplayStyleToggleType
) => {
  localStorage.setItem("display-style-toggle", toggleType);
};

const DisplayStyleCard = () => {
  const [toggleType, setToggleType] = useRecoilState(displayStyleState);
  const { updateToggleType } = useDisplayStyleToggle();
  const handleButtonClick = (key: DisplayStyleToggleType) => {
    if (toggleType === key) return;
    updateToggleType(key);
  };

  return (
    <DisplayStyleCardWrapper>
      <Card
        title={"화면 스타일"}
        gridArea={"displayStyle"}
        width={"350px"}
        height={"183px"}
      >
        <CardContentWrapper>
          <ButtonsWrapperStyled>
            {toggleList.map((item) => {
              const DisplayStyleIcon = item.icon;
              return (
                <ButtonStyled
                  key={item.key}
                  id={`${item.key}`}
                  isClicked={toggleType === item.key}
                  onClick={() => handleButtonClick(item.key)}
                >
                  <DisplayStyleIcon />
                  {item.name}
                </ButtonStyled>
              );
            })}
          </ButtonsWrapperStyled>
        </CardContentWrapper>
      </Card>
    </DisplayStyleCardWrapper>
  );
};

const DisplayStyleCardWrapper = styled.div`
  align-self: start;
`;

const ButtonsWrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  justify-content: space-between;
  padding: 0 16px;
`;

const ButtonStyled = styled.button<{
  isClicked: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  min-width: 50px;
  width: 90px;
  min-width: 50px;
  border-radius: 10px;
  font-size: 1rem;
  height: 90px;
  font-weight: 500;
  background-color: ${(props) =>
    props.isClicked ? "var(--sys-main-color)" : "var(--card-bg-color)"};
  color: ${(props) =>
    props.isClicked
      ? "var(--white-text-with-bg-color)"
      : "var(--normal-text-color)"};
  padding: 12px 0 16px 0;

  & > svg {
    width: 30px;
    height: 30px;
  }

  & > svg > path {
    stroke: ${(props) =>
      props.isClicked
        ? "var(--white-text-with-bg-color)"
        : "var(--normal-text-color)"};
  }
`;

export default DisplayStyleCard;
