import { useEffect, useState } from "react";
import { axiosGetInvalidDates } from "@/api/axios/axios.custom";

const useInvalidDates = () => {
  const [invalidDates, setInvalidDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchInvalidDates = async () => {
      try {
        const response = await axiosGetInvalidDates();
        setInvalidDates(response.data.invalidDateList);
      } catch (error) {
        console.error("Failed to fetch invalid dates:", error);
      }
    };
    fetchInvalidDates();
  }, []);

  return invalidDates;
};

export default useInvalidDates;
