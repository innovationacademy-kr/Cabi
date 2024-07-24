import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentCabinetIdState } from "@/Cabinet/recoil/atoms";
import AdminCabinetLentLog from "@/Cabinet/components/LentLog/AdminCabinetLentLog";
import { LentLogResponseType } from "@/Cabinet/types/dto/lent.dto";
import { axiosGetCabinetLentLog } from "@/Cabinet/api/axios/axios.custom";
import useMenu from "@/Cabinet/hooks/useMenu";

const AdminCabinetLentLogContainer = () => {
  const { closeLent } = useMenu();
  const [logs, setLogs] = useState<LentLogResponseType>(undefined);
  const [page, setPage] = useState<number>(-1);
  const [totalPage, setTotalPage] = useState<number>(-1);
  const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  async function getData(page: number) {
    try {
      const result = await axiosGetCabinetLentLog(currentCabinetId, page);
      setTotalPage(Math.ceil(result.data.totalLength / 10));
      setLogs(result.data.result);
    } catch {
      setLogs(HttpStatusCode.BadRequest);
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

  return (
    <AdminCabinetLentLog
      closeLent={closeAndResetLogPage}
      logs={logs}
      page={page}
      totalPage={totalPage}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
    />
  );
};

export default AdminCabinetLentLogContainer;
