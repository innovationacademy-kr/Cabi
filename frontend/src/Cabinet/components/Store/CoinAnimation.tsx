import { useEffect } from "react";

const CoinAnimation = () => {
  useEffect(() => {
    // dotlottie-player 스크립트 동적 로드
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    document.body.appendChild(script);

    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // dotlottie-player 직접 렌더링
  return (
    <dotlottie-player
      src="https://lottie.host/b2c94e66-b898-4572-988a-b35b0c484274/INuEpKkXRD.json"
      background="transparent"
      speed="1"
      style={{ width: "140px", height: "140px" }}
      loop
      autoplay
    ></dotlottie-player>
  );
};

export default CoinAnimation;
