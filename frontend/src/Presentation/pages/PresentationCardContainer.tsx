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

  return presentations && presentations.length > 0 ? (
    <div
      className="w-full flex flex-wrap gap-8 justify-center px-4"
      style={{ minHeight: 440 }}
    >
      {presentations.map((p) => (
        <div
          key={p.presentationId}
          className="w-[360px] min-h-[420px] flex-shrink-0"
          onClick={() => navigate(`/presentations/${p.presentationId}`)}
        >
          <PresentationCard presentation={p} />
        </div>
      ))}
    </div>
  ) : (
    <div className="w-full flex flex-col items-center justify-center min-h-[220px]">
      <div className="text-base text-gray-500 font-normal text-center">
        해당 카테고리의 발표가 아직 없습니다. <br />
        지금 바로 첫 발표의 주인공이 되어보세요!
      </div>
    </div>
  );
};

export default PresentationCardContainer;
