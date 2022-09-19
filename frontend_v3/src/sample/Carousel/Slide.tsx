import React from "react";
import styled from "@emotion/styled";
import Box from "./Box";

const SlideComponent = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden auto;
  width: 150px;
  height: 480px;
  margin: auto;
  -webkit-overflow-scrolling: auto;
`;

const BoxLineComponet = styled.div`
  display: flex;
`;

interface SlideProps {
  color: string;
}

const Slide = (props: SlideProps): JSX.Element => {
  const { color } = props;

  const countOneRow = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10,
  ];

  const BoxesOneRow = (): JSX.Element[] => {
    // const list: JSX.Element[] = [];
    // for (let index = 0; index < countOneRow.length / 3; index += 1) {
    //   const temp: JSX.Element[] = [];
    //   for (let idx = 0; idx < 3; idx += 1) {
    //     if (countOneRow[index * 3 + idx])
    //       temp.push(<Box key={idx} index={index * 3 + idx} color={color} />);
    //   }
    //   list.push(<BoxLineComponet key={index}>{temp}</BoxLineComponet>);
    // }
    // return list;
    return countOneRow.map((item: number, index: number) => {
      return <Box key={index} index={index} color={color} />;
    });
  };

  const count = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 2, 3],
    [4, 5, 6],
  ];
  const Boxes = (): JSX.Element[] => {
    return count.map((items: number[], index: number) => {
      return (
        <BoxLineComponet key={index}>
          {items.map((item: number, idx: number) => {
            return <Box key={idx} index={idx + index * 3} color={color} />;
          })}
        </BoxLineComponet>
      );
    });
  };
  return (
    <SlideComponent>
      {countOneRow.map((item: number, index: number) => {
        return <Box key={index} index={index} color={color} />;
      })}
    </SlideComponent>
  );
};

export default Slide;
