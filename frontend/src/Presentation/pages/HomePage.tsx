import { ReactComponent as Banner } from "@/Presentation/assets/mainBanner.svg";
import { IPresentation } from "@/Presentation/components/PresentationCard";
import PresentationCardContainer from "@/Presentation/pages/PresentationCardContainer";
import React, { useEffect, useState } from "react";

// TODO: mockData 실제 API로 대체해야함!!
const mockData: IPresentation[] = [
  {
    id: 1,
    thumbnailLink:
      "https://fastly.picsum.photos/id/238/2560/1440.jpg?hmac=wKo4dLHwDntZmO_fdtnKtsnmRcPMACca3m5J5vx2AVc",
    category: "학술",
    isUpcomming: true,
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
      "https://fastly.picsum.photos/id/201/5000/3333.jpg?hmac=NE8fOMa8u9PBfkq4AVwEoJdRqoPTNwUsyKvKWuXyNCk",
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
      "https://fastly.picsum.photos/id/160/3200/2119.jpg?hmac=cz68HnnDt3XttIwIFu5ymcvkCp-YbkEBAM-Zgq-4DHE",
    category: "토의",
    isUpcomming: false,
    likeCount: 8,
    title: "ft_transcendance 회고",
    startTime: "2025-03-01T10:00:00",
    userName: "jihykim2",
    summary:
      "Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서 Cabi 수요지식회에서 발표했던 내용에 대해서 Cabi 수요지식회에서",
  },
];

const HomePage: React.FC = () => {
  const [presentations] = useState<IPresentation[]>(mockData);

  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-y-auto pb-11">
      <div className="relative w-full">
        <Banner className="w-full h-auto block" />
        <div className="w-full h-[30px] bg-white" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <PresentationCardContainer presentations={presentations} />
      </div>
    </div>
  );
};

export default HomePage;
