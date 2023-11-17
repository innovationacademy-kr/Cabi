import ExtensionCard from "@/components/Card/ExtensionCard/ExtensionCard";

const ExtensionCardContainer = ({ extensible }: { extensible: boolean }) => {
  return (
    <ExtensionCard
      extensible={extensible}
      button={{
        label: extensible ? "보유중" : "미보유",
        onClick: () => {},
        isClickable: false,
        isExtensible: extensible,
      }}
    />
  );
};

export default ExtensionCardContainer;
