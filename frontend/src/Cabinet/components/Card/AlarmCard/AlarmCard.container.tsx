import {
  deleteFcmToken,
  requestFcmAndGetDeviceToken,
} from "@/Cabinet/firebase/firebase-messaging-sw";
import { useEffect, useMemo, useState } from "react";
import AlarmCard from "@/Cabinet/components/Card/AlarmCard/AlarmCard";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import { AlarmInfo } from "@/Cabinet/types/dto/alarm.dto";
import {
  axiosUpdateAlarmReceptionPath,
  axiosUpdateDeviceToken,
} from "@/Cabinet/api/axios/axios.custom";
import useDebounce from "@/Cabinet/hooks/useDebounce";

const AlarmCardContainer = ({ alarm }: { alarm: AlarmInfo | null }) => {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContents, setModalContents] = useState<string | null>(null);
  const [alarms, setAlarms] = useState({ current: alarm, original: alarm });
  const [isLoading, setIsLoading] = useState(false);
  const isModified = useMemo(
    () => JSON.stringify(alarms.current) !== JSON.stringify(alarms.original),
    [alarms]
  );
  const { debounce } = useDebounce();

  useEffect(() => {
    setAlarms({ current: alarm, original: alarm });
  }, [alarm]);

  const updateAlarmReceptionPath = async () => {
    try {
      // 푸쉬 알림 설정이 변경되었을 경우, 토큰을 요청하거나 삭제합니다.
      if (alarms.current!.push) {
        const deviceToken = await requestFcmAndGetDeviceToken();
        await axiosUpdateDeviceToken(deviceToken);
      } else {
        await deleteFcmToken();
        await axiosUpdateDeviceToken(null);
      }
      await axiosUpdateAlarmReceptionPath(alarms.current!);
      setAlarms({ current: alarms.current, original: alarms.current });
      setModalTitle("설정이 저장되었습니다");
    } catch (error: any) {
      setAlarms((prev) => ({ ...prev, current: prev.original }));
      setHasErrorOnResponse(true);
      if (error.response) setModalTitle(error.response.data.message);
      else {
        setModalTitle(error.name);
        setModalContents(error.message);
      }
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const handleToggleChange = (type: keyof AlarmInfo, checked: boolean) => {
    setAlarms((prev) => {
      const current = prev.current
        ? { ...prev.current, [type]: checked }
        : null;
      return {
        ...prev,
        current,
      };
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    if (!alarms.current) return;
    debounce("alarmReceptionPath", updateAlarmReceptionPath, 300);
  };

  const handleCancel = () => {
    !isLoading && setAlarms((prev) => ({ ...prev, current: prev.original }));
  };

  const handleCloseModal = () => {
    setShowResponseModal(false);
  };

  return (
    <>
      <AlarmCard
        key={JSON.stringify(alarms)}
        alarm={alarms.current ?? { email: false, push: false, slack: false }}
        buttons={
          isModified
            ? [
                {
                  label: "저장",
                  onClick: handleSave,
                  fontColor: "var(--white-text-with-bg-color)",
                  backgroundColor: "var(--sys-main-color)",
                  isClickable: true,
                  isLoading: isLoading,
                },
                {
                  label: "취소",
                  onClick: handleCancel,
                  isClickable: !isLoading,
                  isLoading: isLoading,
                },
              ]
            : [
                // NOTE: 이 부분은 레이아웃을 유지하기 위한 placeholder 버튼입니다.
                {
                  label: "-",
                  isClickable: false,
                  fontColor: "var(--card-bg-color)",
                  backgroundColor: "var(--card-bg-color)",
                },
              ]
        }
        onToggleChange={handleToggleChange}
        isLoading={isLoading}
      />
      <ModalPortal>
        {showResponseModal &&
          (hasErrorOnResponse ? (
            <FailResponseModal
              modalTitle={modalTitle}
              modalContents={modalContents}
              closeModal={handleCloseModal}
            />
          ) : (
            <SuccessResponseModal
              modalTitle={modalTitle}
              modalContents={modalContents}
              closeModal={handleCloseModal}
            />
          ))}
      </ModalPortal>
    </>
  );
};

export default AlarmCardContainer;
