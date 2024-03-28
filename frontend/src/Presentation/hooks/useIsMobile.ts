import { useEffect, useRef, useState } from "react";
import { axiosGetInvalidDates } from "@/Presentation/api/axios/axios.custom";

const useIsMobile = () => {
  const [useIsMobile, setUseIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1150) setUseIsMobile(true);
      else setUseIsMobile(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return useIsMobile;
};

export default useIsMobile;
