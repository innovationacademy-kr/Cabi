import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentCabinetIdState } from "@/recoil/atoms";
import AdminCabinetLentLog from "@/components/LentLog/AdminCabinetLentLog";
import { LentLogDto } from "@/types/dto/lent.dto";
import { axiosGetCabinetLentLog } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const AdminCabinetLentLogContainer = () => {
  const { closeLent } = useMenu();
  const [logs, setLogs] = useState<
    LentLogDto[] | typeof STATUS_400_BAD_REQUEST | undefined
  >(undefined);
  const [page, setPage] = useState<number>(-1);
  const [totalPage, setTotalPage] = useState<number>(-1);
  const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  async function getData(page: number) {
    try {
      const result = await axiosGetCabinetLentLog(currentCabinetId, page);
      setTotalPage(Math.ceil(result.data.total_length / 10));
      setLogs(result.data.result);
    } catch {
      setLogs(STATUS_400_BAD_REQUEST);
      setTotalPage(1);
    }
  }
  useEffect(() => {
    setPage(0);
    getData(0);
  }, [currentCabinetId]);

  useEffect(() => {
    if (needsUpdate || page > 0) {
      setNeedsUpdate(false);
      getData(page);
    }
  }, [page]);

  const onClickPrev = () => {
    if (page == 0) return;
    setNeedsUpdate(true);
    setPage((prev) => prev - 1);
  };

  const onClickNext = () => {
    if (page == totalPage - 1) return;
    setPage((prev) => prev + 1);
  };

  const closeAndResetLogPage = () => {
    closeLent();
    setNeedsUpdate(true);
    setPage(0);
  };

  if (!currentCabinetId) return null;

  return (
    <AdminCabinetLentLog
      closeAndResetLogPage={closeAndResetLogPage}
      logs={logs}
      page={page}
      totalPage={totalPage}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
    />
  );
};

export default AdminCabinetLentLogContainer;
