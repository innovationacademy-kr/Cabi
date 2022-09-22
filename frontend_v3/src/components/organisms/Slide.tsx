import React from "react";
import styled from "@emotion/styled";
import CabinetBoxButton from "../atoms/buttons/CabinetBoxButton";
import MockDatas, { MockData } from "../../mock/CabinetBoxButton.mock";

const SlideComponent = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow: hidden auto;
  width: 270px;
  height: 480px;
  margin: auto;
  -webkit-overflow-scrolling: auto;
`;

interface SlideProps {
  datas: MockData[];
}

const Slide = (props: SlideProps): JSX.Element => {
  const { datas } = props;
  return (
    <SlideComponent>
      {datas.map((item: MockData, index: number) => {
        return (
          <CabinetBoxButton
            key={index}
            cabinet_type={item.cabinet_type}
            cabinet_number={item.cabinet_number}
            is_expired={item.is_expired}
            lender={item.lender}
            isLent={item.isLent}
            user={item.user}
          />
        );
      })}
    </SlideComponent>
  );
};

export default Slide;
