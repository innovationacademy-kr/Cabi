import React from "react";
import { useNavigate } from "react-router-dom";
import PresentationCard, {
  IPresentation,
} from "@/Presentation/components/PresentationCard";

interface PresentationCardContainerProps {
  presentations: IPresentation[];
  maxCols?: number;
}

const PresentationCardContainer: React.FC<PresentationCardContainerProps> = ({
  presentations,
  maxCols = 3,
}) => {
  const navigate = useNavigate();

  if (!presentations?.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[220px]">
        <div className="text-base text-gray-500 font-normal text-center">
          해당 카테고리의 발표가 아직 없습니다. <br />
          지금 바로 첫 발표의 주인공이 되어보세요!
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid xl:grid-cols-${maxCols} lg:grid-cols-2 sm:grid-cols-1 gap-8`}
    >
      {presentations.map((p) => (
        <div key={p.presentationId} className="w-full flex justify-center">
          <div
            className="w-full max-w-[360px] aspect-[4/5] cursor-pointer"
            onClick={() => navigate(`/presentations/${p.presentationId}`)}
          >
            <PresentationCard presentation={p} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PresentationCardContainer;
