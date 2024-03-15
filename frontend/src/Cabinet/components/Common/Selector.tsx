import PillButton from "@/Cabinet/components/Common/PillButton";
import styled from "styled-components";

interface ISelectorProps {
  iconSrc?: string;
  selectList: { key: number; value: string }[];
  onClickSelect: any;
}

const Selector = ({ iconSrc, selectList, onClickSelect }: ISelectorProps) => {
  return (
    <SelectorWrapperStyled>
      <IconWrapperStyled>
        <img src={iconSrc} />
      </IconWrapperStyled>
      {selectList &&
        selectList.map((elem) => {
          return (
            <PillButton
              key={elem.key}
              theme="line"
              text={elem.value}
              onClickButton={() => {
                onClickSelect(elem.key);
              }}
            />
          );
        })}
    </SelectorWrapperStyled>
  );
};

const SelectorWrapperStyled = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const IconWrapperStyled = styled.div`
  width: 24px;
  height: 24px;
  margin-bottom: 12px;
`;

export default Selector;
