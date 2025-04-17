import { useSearchParams } from "react-router-dom";

const useURLSearchParams = () => {
  const [searchParams] = useSearchParams();

  const getSearchParam = (name: string) => searchParams.get(name);

  return { getSearchParam };
};

export default useURLSearchParams;
