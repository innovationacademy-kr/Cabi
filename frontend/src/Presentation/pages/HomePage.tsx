import {
  Presentation,
  PresentationCard,
} from "@/Presentation/components/PresentationCard";
import React from "react";

// TODO: mockData 실제 API로 대체해야함!!
const mockData: Presentation[] = [
  {
    id: 1,
    thumbnailLink:
      "https://fastly.picsum.photos/id/18/2500/1667.jpg?hmac=JR0Z_jRs9rssQHZJ4b7xKF82kOj8-4Ackq75D_9Wmz8", // 임시방편으로 일단 넣기 -> 썸네일 첨부 안할때 기본 이미지 정해야함
    category: "학술",
    isUpcomming: false,
    likeCount: 16,
    title: "이노콘 수요지식회 발표를 마치며",
    startTime: "2025-02-25T15:30:00",
    userName: "jusohn",
    summary:
      "Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서 Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서",
  },
  {
    id: 2,
    thumbnailLink:
      "https://fastly.picsum.photos/id/4/5000/3333.jpg?hmac=ghf06FdmgiD0-G4c9DdNM8RnBIN7BO0-ZGEw47khHP4",
    category: "개발",
    isUpcomming: false,
    likeCount: 23,
    title: "Cabi 프론트엔드 개발기",
    startTime: "2025-02-26T14:00:00",
    userName: "gykoh",
    summary:
      "Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서 Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서",
  },
  {
    id: 3,
    thumbnailLink:
      "https://fastly.picsum.photos/id/74/4288/2848.jpg?hmac=q02MzzHG23nkhJYRXR-_RgKTr6fpfwRgcXgE0EKvNB8",
    category: "42",
    isUpcomming: true,
    likeCount: 8,
    title: "ft_transcendance 회고",
    startTime: "2025-03-01T10:00:00",
    userName: "gykoh",
    summary:
      "Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서 Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서",
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="h-screen overflow-y-auto">
      <div className="w-full h-[220px] bg-[#ECEEF9] flex items-center justify-center">
        배너 추가할 섹션
      </div>

      <div className="w-full h-[60px] bg-[#ECEEF9] flex items-center justify-center mt-6">
        카테고리 / 정렬 필터 여기에 추가!
      </div>

      <div className="max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-6">
          {mockData.map((p) => (
            <PresentationCard key={p.id} presentation={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
