import { ReactComponent as Banner } from "@/Presentation/assets/mainBanner.svg";
import { IPresentation } from "@/Presentation/components/PresentationCard";
import PresentationCardContainer from "@/Presentation/pages/PresentationCardContainer";
import React, { useEffect, useState } from "react";

// TODO: mockData 실제 API로 대체해야함!!
const mockData: IPresentation[] = [
  {
    id: 1,
    thumbnailLink:
      "https://fastly.picsum.photos/id/36/4179/2790.jpg?hmac=OCuYYm0PkDCMwxWhrtoSefG5UDir4O0XCcR2x-aSPjs",
    category: "학술",
    presentationStatus: "UPCOMING",
    likeCount: 16,
    title: "생성형 AI 잘 사용하기",
    startTime: "2025-02-25T15:30:00",
    userName: "jusohn",
    summary:
      "최신 Generative AI 기술을 활용하여 개발 워크플로우를 최적화하고 생산성을 극대화하는 방법에 대해 알아봅니다. 코딩, 테스트, 문서화 등 다양한 개발 단계에서 AI가 어떻게 도움을 줄 수 있는지 실제 사례와 함께 소개합니다.",
  },
  {
    id: 2,
    thumbnailLink:
      "https://fastly.picsum.photos/id/201/5000/3333.jpg?hmac=NE8fOMa8u9PBfkq4AVwEoJdRqoPTNwUsyKvKWuXyNCk",
    category: "개발",
    presentationStatus: "DONE",
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
    presentationStatus: "DONE",
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
    <>
      <div className="relative w-full">
        <Banner className="w-full h-auto block" />
        <div className="w-full h-[30px] bg-white" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <PresentationCardContainer presentations={presentations} />
      </div>
    </> 
  );
};

export default HomePage;
