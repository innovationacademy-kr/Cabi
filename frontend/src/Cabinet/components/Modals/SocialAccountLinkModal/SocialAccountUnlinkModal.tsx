import { HttpStatusCode } from "axios";

const SocialAccountUnlinkModal = ({
  tryDisconnectSocialAccount,
  getMyInfo,
}: {
  tryDisconnectSocialAccount: () => Promise<any>;
  getMyInfo: () => Promise<void>;
}) => {
  // TODO : 아무 버튼 누르면 모든 실행이 다 끝나고 finally setIsUnlinkModalOpen(false)
  // TODO : yes 버튼 누르면
  // const response = await tryDisconnectSocialAccount();
  // if (response.status === HttpStatusCode.Ok) {
  //   await getMyInfo();
  // }

  return (
    <>
      SocialAccountUnlinkModal
      <button
        // yes 버튼이라 가정
        onClick={async () => {
          const response = await tryDisconnectSocialAccount();
          if (response.status === HttpStatusCode.Ok) {
            await getMyInfo();
          }
        }}
      >
        yes
      </button>
    </>
  );
};

export default SocialAccountUnlinkModal;
