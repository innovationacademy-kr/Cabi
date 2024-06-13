import styled from "styled-components";
import { ReactComponent as SadCabiIcon } from "@/Cabinet/assets/images/sadCcabi.svg";

const UnavailableDataInfo = ({
  msg,
  height,
  fontSize,
  iconWidth,
  iconHeight,
}: {
  msg: string;
  height?: string;
  fontSize?: string;
  iconWidth?: string;
  iconHeight?: string;
}) => {
  return (
    <EmptyWrapperStyled>
      <EmptyItemUsageLogTextStyled height={height} fontSize={fontSize}>
        {msg}
      </EmptyItemUsageLogTextStyled>
      <SadCcabiIconStyled width={iconWidth} height={iconHeight}>
        <SadCabiIcon />
      </SadCcabiIconStyled>
    </EmptyWrapperStyled>
  );
};

const EmptyWrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const EmptyItemUsageLogTextStyled = styled.div<{
  height: string | undefined;
  fontSize: string | undefined;
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => (props.fontSize ? props.fontSize : "1.125rem")};
  line-height: 1.75rem;
  color: var(--gray-line-btn-color);
  height: ${(props) => props.height && props.height};
`;

const SadCcabiIconStyled = styled.div<{
  width: string | undefined;
  height: string | undefined;
}>`
  width: ${(props) => (props.width ? props.width : "30px")};
  height: ${(props) => (props.height ? props.height : "30px")};
  margin-left: 10px;

  & > svg {
    width: ${(props) => (props.width ? props.width : "30px")};
    height: ${(props) => (props.height ? props.height : "30px")};
  }

  & > svg > path {
    fill: var(--normal-text-color);
  }
`;

export default UnavailableDataInfo;
