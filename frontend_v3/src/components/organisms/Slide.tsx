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
  @media (max-width: 281px) {
    width: 195px;
  }
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
            status={item.status}
            type={item.lent_type}
            box={
              <LentBox
                key={index}
                cabinet_title={item.cabinet_title}
                cabinet_type={item.lent_type}
                cabinet_number={item.cabinet_num}
                cabinet_id={item.cabinet_id}
                lender={item.lent_info}
                status={item.status}
              />
            }
            button={
              <CabinetBoxButton
                key={index}
                cabinet_type={item.lent_type}
                cabinet_number={item.cabinet_num}
                cabinet_id={item.cabinet_id}
                cabinet_title={item.cabinet_title}
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
