import React from "react";
import { useNavigate } from "react-router-dom";
import PresentationCard, {
  IPresentation,
} from "@/Presentation/components/PresentationCard";

interface PresentationCardContainerProps {
  presentations: IPresentation[];
}

const PresentationCardContainer: React.FC<PresentationCardContainerProps> = ({
  presentations,
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
