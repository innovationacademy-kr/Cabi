import { axiosCabinetById } from "@/api/axios/axios.custom";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { SetterOrUpdater } from "recoil";
import useMenu from "./useMenu";

export const adminHandleCabinet = (
  target: HTMLTableElement,
  setSelectedTypeOnSearch: SetterOrUpdater<string>,
  setCurrentCabinetId: SetterOrUpdater<number>,
  setTargetCabinetInfo: SetterOrUpdater<CabinetInfo>,
  openCabinet: Function
) => {
  const str = target.dataset.info;
  openCabinet();
  let cabinetId = -1;
  if (str) cabinetId = JSON.parse(str)?.cabinet_id;
  getData(cabinetId);
  setSelectedTypeOnSearch("CABINET");
  async function getData(cabinetId: number) {
    try {
      const { data } = await axiosCabinetById(cabinetId);
      setCurrentCabinetId(cabinetId);
      setTargetCabinetInfo(data);
    } catch (error) {
      console.log(error);
    }
  }
};
