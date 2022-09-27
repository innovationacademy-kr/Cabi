import React from "react";
import styled from "@emotion/styled";
import CabinetBoxButton from "../atoms/buttons/CabinetBoxButton";
import GuideModal from "../atoms/modals/GuideModal";
import LentBox from "../atoms/modals/LentBox";
import CabinetStatus from "../../types/enum/cabinet.status.enum";
import { CabinetInfo } from "../../types/dto/cabinet.dto";

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
  datas: CabinetInfo[];
}

const Slide = (props: SlideProps): JSX.Element => {
  const { datas } = props;
  return (
    <SlideComponent>
      {datas.map((item: CabinetInfo, index: number) => {
        return (
          // TODO; gyuwlee
          // LentBox 와 CabinetBoxButton에서 불필요한 props 제거
          <GuideModal
            key={index}
            box={
              <LentBox
                key={index}
                cabinet_type={item.lent_type}
                cabinet_number={item.cabinet_num}
                lender={item.lent_info}
                isLentAble={item.status === CabinetStatus.AVAILABLE}
              />
            }
            button={
              <CabinetBoxButton
                key={index}
                cabinet_type={item.lent_type}
                cabinet_number={item.cabinet_num}
                lender={item.lent_info}
                status={item.status}
              />
            }
          />
        );
      })}
    </SlideComponent>
  );
};

export default Slide;
