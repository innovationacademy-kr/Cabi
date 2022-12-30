import React from "react";
import { useRecoilValue } from "recoil";
import { currentSectionCabinetState } from "@/recoil/selectors";
import CabinetListContainer from "@/containers/CabinetListContainer";
import { CabinetInfo } from "@/types/dto/cabinet.dto";

const CabinetList: React.FC<{ colNum: number }> = (props) => {
  const { colNum } = props;
  const CABINETS = useRecoilValue<CabinetInfo[]>(currentSectionCabinetState);

  return <CabinetListContainer colNum={colNum} cabinetInfo={CABINETS} />;
};

export default CabinetList;
