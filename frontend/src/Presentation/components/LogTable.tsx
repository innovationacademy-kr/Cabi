import { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";

interface PresentationHistoryDto {
  presentationId: number;
  startTime: string;
  presentationLocation: "BASEMENT" | "FIRST" | "THIRD";
  title: string;
  presentationStatus: "DONE" | "UPCOMING" | "CANCELED";
}
type PresentationHistoryResponseType =
  | PresentationHistoryDto[]
  | number
  | undefined;

interface LogTableProps {
  presentationHistory: PresentationHistoryResponseType;
}

const locationMap = {
  BASEMENT: "지하 1층 ",
  FIRST: "1층",
  THIRD: "3층",
};

const statusMap = {
  DONE: "완료",
  UPCOMING: "예정",
  CANCELED: "취소",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${d} ${h}:${min}`;
}

const LogTable = ({ presentationHistory }: LogTableProps) => {
  const navigate = useNavigate();

  if (presentationHistory === undefined) return <LoadingAnimation />;

  if (
    presentationHistory === HttpStatusCode.BadRequest ||
    (Array.isArray(presentationHistory) && presentationHistory.length === 0)
  ) {
    return (
      <div className="w-full text-center text-base py-6">
        발표 기록이 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-md">
      <table className="w-full bg-white">
        <thead>
          <tr className="bg-blue-600 text-white h-12">
            <th className="text-center pl-6 align-middle w-2/5">제목</th>
            <th className="text-center align-middle w-1/5">발표일</th>
            <th className="text-center align-middle w-1/5">장소</th>
            <th className="text-center align-middle w-1/5">상태</th>
          </tr>
        </thead>
        <tbody>
          {(presentationHistory as PresentationHistoryDto[]).map(
            (
              {
                presentationId,
                title,
                startTime,
                presentationLocation,
                presentationStatus,
              },
              idx
            ) => (
              <tr
                key={presentationId}
                className={`cursor-pointer transition-colors ${
                  idx % 2 === 1 ? "bg-gray-50" : ""
                } hover:bg-blue-100`}
                onClick={() => navigate(`/presentations/${presentationId}`)}
              >
                <td className="text-black text-center pl-6 py-3">{title}</td>
                <td className="text-black text-center py-3">{formatDate(startTime)}</td>
                <td className="text-black text-center py-3">
                  {locationMap[presentationLocation]}
                </td>
                <td className="text-black text-center py-3">
                  {statusMap[presentationStatus]}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
