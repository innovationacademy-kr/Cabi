import { useEffect, useState } from "react";

const useIsMobile = (mobileView: number) => {
  const [useIsMobile, setUseIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < mobileView) setUseIsMobile(true);
      else setUseIsMobile(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return useIsMobile;
};

export default useIsMobile;
