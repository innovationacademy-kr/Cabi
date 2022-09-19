import React from "react";
import styled from "@emotion/styled";

const BoxComponent = styled.div`
  display: inline-block;
  width: 48px;
  height: 48px;
  border: 1px solid
    ${(props): string | undefined => (props ? props.color : `black`)};
`;

interface BoxProps {
  index: number;
  color: string;
}
const Box = (props: BoxProps): JSX.Element => {
  const { index, color } = props;
  return <BoxComponent color={color}>{index}</BoxComponent>;
};

export default Box;
