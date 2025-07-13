import React, { SetStateAction } from "react";
import TopNav from "@/Presentation/components/TopNav";

const TopNavContainer: React.FC<{
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}> = () => {
  return <TopNav />;
};

export default TopNavContainer;
