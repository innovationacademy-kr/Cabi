import { useEffect, useState } from "react";
import LentLog from "@/components/LentLog/LentLog";
import { LentLogDto } from "@/types/dto/lent.dto";
import { axiosMyLentLog } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const LentLogContainer = () => {
  const { closeLent } = useMenu();
  const [logs, setLogs] = useState<
    LentLogDto[] | typeof STATUS_400_BAD_REQUEST | undefined
  >(undefined);
  const [page, setPage] = useState<number>(-1);
  const [totalPage, setTotalPage] = useState<number>(-1);
  async function getData(page: number) {
    try {
      const result = await axiosMyLentLog(0);
      setTotalPage(Math.floor(result.data.total_length / 10) + 1);
      setLogs(result.data.result);
    } catch {
      setLogs(STATUS_400_BAD_REQUEST);
    }
  }
  useEffect(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    if (page >= 0) {
      getData(page);
    }
  }, [page]);

  const onClickPrev = () => {
    if (page == 1) return;
    setPage((prev) => prev - 1);
  };
  const onClickNext = () => {
    if (page == totalPage) return;
    setPage((prev) => prev + 1);
  };

  return (
    <LentLog
      closeLent={closeLent}
      logs={logs}
      page={page}
      totalPage={totalPage}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
    />
  );
};

export default LentLogContainer;
