import React from "react";
import styled from "@emotion/styled";
import CabinetBoxButton from "../atoms/buttons/CabinetBoxButton";
import MockDatas, { MockData } from "../../mock/CabinetBoxButton.mock";
import GuideModal from "../atoms/modals/GuideModal";
import LentBox from "../atoms/modals/LentBox";
import CabinetStatus from "../../types/enum/cabinet.status.enum";

const SlideComponent = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow: hidden auto;
  width: 270px;
  height: 100%;
  margin: auto;
  &::-webkit-scrollbar {
    display: none;
  }
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
          // TODO; gyuwlee
          // LentBox 와 CabinetBoxButton에서 불필요한 props 제거
          <GuideModal
            box={
              <LentBox
                key={index}
                cabinet_type={item.cabinet_type}
                cabinet_number={item.cabinet_number}
                lender={item.lender}
                isLentAble={item.status === CabinetStatus.AVAILABLE}
              />
            }
            button={
              <CabinetBoxButton
                key={index}
                cabinet_type={item.cabinet_type}
                cabinet_number={item.cabinet_number}
                is_expired={item.is_expired}
                lender={item.lender}
                activation={item.status}
                user={item.user}
              />
            }
          />
        );
      })}
    </SlideComponent>
  );
};

export default Slide;
