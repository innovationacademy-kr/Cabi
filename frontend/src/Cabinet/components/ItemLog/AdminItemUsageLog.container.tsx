import { useEffect, useState } from "react";
import AdminItemUsageLog from "@/Cabinet/components/ItemLog/AdminItemUsageLog";
import { ItemLogResponseType } from "@/Cabinet/types/dto/admin.dto";
import useMenu from "@/Cabinet/hooks/useMenu";
import { STATUS_400_BAD_REQUEST } from "@/Cabinet/constants/StatusCode";

const AdminItemUsageLogContainer = () => {
  const { closeStore } = useMenu();
  const [logs, setLogs] = useState<ItemLogResponseType>({
    itemHistories: [],
    totalLength: 0,
  });
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(-1);
  const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);
  const size = 8;

  const mockItemHistories = [
    {
      purchasedAt: "2023-05-26T14:00:00",
      usedAt: "2023-05-27T00:00:00",
      itemName: "연장권",
      itemDetails: "3일",
    },
    {
      purchasedAt: "2023-05-25T13:00:00",
      usedAt: "2023-05-26T10:00:00",
      itemName: "이사권",
      itemDetails: "이사권",
    },
    {
      purchasedAt: "2023-05-24T16:00:00",
      usedAt: "2023-05-25T11:00:00",
      itemName: "페널티 감면권",
      itemDetails: "5일",
    },
    {
      purchasedAt: "2023-05-24T16:00:00",
      usedAt: "",
      itemName: "페널티 감면권",
      itemDetails: "5일",
    },
    {
      purchasedAt: "2023-05-26T14:00:00",
      usedAt: "2023-05-27T00:00:00",
      itemName: "연장권",
      itemDetails: "3일",
    },
    {
      purchasedAt: "2023-05-25T13:00:00",
      usedAt: "2023-05-26T10:00:00",
      itemName: "이사권",
      itemDetails: "이사권",
    },
    {
      purchasedAt: "2023-05-24T16:00:00",
      usedAt: "2023-05-25T11:00:00",
      itemName: "페널티 감면권",
      itemDetails: "5일",
    },
    {
      purchasedAt: "2023-05-24T16:00:00",
      usedAt: "2023-05-25T11:00:00",
      itemName: "페널티 감면권",
      itemDetails: "5일",
    },
    {
      purchasedAt: "2023-05-26T14:00:00",
      usedAt: "2023-05-27T00:00:00",
      itemName: "연장권",
      itemDetails: "3일",
    },
    {
      purchasedAt: "2023-05-25T13:00:00",
      usedAt: "",
      itemName: "이사권",
      itemDetails: "이사권",
    },
    {
      purchasedAt: "2023-05-24T16:00:00",
      usedAt: "2023-05-25T11:00:00",
      itemName: "페널티 감면권",
      itemDetails: "5일",
    },
    {
      purchasedAt: "2023-05-24T16:00:00",
      usedAt: "2023-05-25T11:00:00",
      itemName: "페널티 감면권",
      itemDetails: "5일",
    },
  ];

  async function getData(page: number) {
    try {
      const paginatedData = {
        itemHistories: mockItemHistories.slice(page * size, (page + 1) * size),
        totalLength: mockItemHistories.length,
      };
      setLogs(paginatedData);
      setTotalPage(Math.ceil(paginatedData.totalLength / size));
    } catch {
      setLogs({ itemHistories: [], totalLength: 0 });
      setTotalPage(1);
    }
  }

  useEffect(() => {
    getData(page);
  }, [page]);

  useEffect(() => {
    if (needsUpdate) {
      getData(page);
      setNeedsUpdate(false);
    }
  }, [needsUpdate, page]);

  const onClickPrev = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
      setNeedsUpdate(true);
    }
  };

  const onClickNext = () => {
    if (page < totalPage - 1) {
      setPage((prev) => prev + 1);
      setNeedsUpdate(true);
    }
  };

  const closeAndResetLogPage = () => {
    closeStore();
    setPage(0);
    setNeedsUpdate(true);
  };

  return (
    <AdminItemUsageLog
      closeItem={closeAndResetLogPage}
      logs={logs}
      page={page}
      totalPage={totalPage}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
    />
  );
};

export default AdminItemUsageLogContainer;
