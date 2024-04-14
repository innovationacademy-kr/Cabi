import { useRecoilState } from "recoil";
import { darkModeState } from "@/recoil/atoms";

const DarkMode: React.FC<{}> = () => {
  const [test, setTest] = useRecoilState(darkModeState);
  //   console.log(test);

  return (
    <>
      <button
        onClick={() => {
          setTest(
            test === "white" ? "var(--normal-text-color)" : "var(--bg-color)"
          );
        }}
      >
        dark mode
      </button>
    </>
  );
};

export default DarkMode;
