import { axiosMyLentLog } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";
import { useEffect, useState } from "react";
import LentLog from "./LentLog";

interface ILogData {
  loc: string;
  lent_begin: string;
  lent_end: string;
}

const LentLogContainer = () => {
  const { closeLent } = useMenu();
  const [logs, setLogs] = useState<ILogData[]>([]);
  const [page, setPage] = useState<number>(-1);
  const [totalPage, setTotalPage] = useState<number>(-1);
  async function getData(page: number) {
    try {
      const result = await axiosMyLentLog(0);
      setTotalPage(Math.floor(result.data.total_length / 10) + 1);
      setLogs(
        result.data.result.map(
          ({
            floor,
            cabinet_num,
            lent_time,
            return_time,
          }: {
            floor: Number;
            cabinet_num: Number;
            lent_time: String;
            return_time: String;
          }) => ({
            loc: `${floor}F - ${cabinet_num}`,
            lent_begin: lent_time.slice(2, 10),
            lent_end: return_time.slice(2, 10),
          })
        )
      );
    } catch (e) {
      throw e;
    }
  }
  useEffect(() => {
    setPage(1);
    getData(1);
  }, []);

  const onClickPrev = () => {
    if (page == 1) return;
    setPage(page - 1);
    getData(page - 1);
  };
  const onClickNext = () => {
    if (page == totalPage) return;
    setPage(page + 1);
    getData(page + 1);
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
