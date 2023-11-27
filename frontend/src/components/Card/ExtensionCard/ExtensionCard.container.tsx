import ExtensionCard from "@/components/Card/ExtensionCard/ExtensionCard";
import { LentExtensionDto } from "@/types/dto/lent.dto";

const ExtensionCardContainer = ({
  extensionInfo,
}: {
  extensionInfo: LentExtensionDto | null;
}) => {
  return (
    <ExtensionCard
      extensionInfo={extensionInfo}
      button={{
        label: !!extensionInfo ? "보유중" : "미보유",
        onClick: () => {},
        isClickable: false,
        isExtensible: !!extensionInfo,
      }}
    />
  );
};

export default ExtensionCardContainer;
