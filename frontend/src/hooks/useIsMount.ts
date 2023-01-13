import React, { useEffect } from "react";

const useIsMount = () => {
  const isMountRef = React.useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};

export default useIsMount;
