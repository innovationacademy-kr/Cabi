import { useEffect, useState } from "react";
import useMenu from "@/hooks/useMenu";
import AdminUserLentLog from "@/components/LentLog/AdminUserLentLog";
import { LentLogDto } from "@/types/dto/lent.dto";
import { useRecoilValue } from "recoil";
import { targetUserInfoState } from "@/recoil/atoms";
import { axiosGetUserLentLog } from "@/api/axios/axios.custom";

const BAD_REQUEST = 400;

const AdminUserLentLogContainer = () => {
  const { closeLent } = useMenu();
  const [logs, setLogs] = useState<
    LentLogDto[] | typeof BAD_REQUEST | undefined
  >(undefined);
  const [page, setPage] = useState<number>(-1);
  const [totalPage, setTotalPage] = useState<number>(-1);
  const [isNeedUpdate, setIsNeedUpdate] = useState<boolean>(false);
  const targetUserInfo = useRecoilValue(targetUserInfoState);
  async function getData(page: number) {
    try {
      const result = await axiosGetUserLentLog(targetUserInfo.userId, page);
      setTotalPage(Math.ceil(result.data.total_length / 10));
      setLogs(result.data.result);
    } catch {
      setLogs(BAD_REQUEST);
      setTotalPage(1);
    }
  }

  useEffect(() => {
    setPage(0);
    getData(0);
  }, [targetUserInfo]);

  useEffect(() => {
    if (isNeedUpdate || page > 0) {
      setIsNeedUpdate(false);
      getData(page);
    }
  }, [page]);

  const onClickPrev = () => {
    if (page == 0) return;
    setIsNeedUpdate(true);
    setPage((prev) => prev - 1);
  };

  const onClickNext = () => {
    if (page == totalPage - 1) return;
    setPage((prev) => prev + 1);
  };

  const closeAndResetLogPage = () => {
    closeLent();
    setIsNeedUpdate(true);
    setPage(0);
  };

  return targetUserInfo ? (
    <AdminUserLentLog
      closeAndResetLogPage={closeAndResetLogPage}
      logs={logs}
      page={page}
      totalPage={totalPage}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
    />
  ) : (
    <></>
  );
};

export default AdminUserLentLogContainer;
