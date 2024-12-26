import styled from "styled-components";
import PillButton from "@/Cabinet/components/Common/PillButton";

interface ISelectorProps {
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  selectList: { key: number; value: string }[];
  onClickSelect: any;
}

const Selector = ({ icon, selectList, onClickSelect }: ISelectorProps) => {
  const Icon = icon;
  return (
    <SelectorWrapperStyled>
      <IconWrapperStyled>{Icon && <Icon />}</IconWrapperStyled>
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

  & > svg > path {
    stroke: var(--normal-text-color);
  }
`;

export default Selector;
