import {
  deleteFcmToken,
  requestFcmAndGetDeviceToken,
} from "@/firebase/firebase-messaging-sw";
import { useEffect, useMemo, useState } from "react";
import { set } from "react-ga";
import NotificationCard from "@/components/Card/NotificationCard/NotificationCard";
import ModalPortal from "@/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import { AlarmInfo } from "@/types/dto/alarm.dto";
import {
  axiosUpdateAlarm,
  axiosUpdateDeviceToken,
} from "@/api/axios/axios.custom";

const NotificationCardContainer = ({ alarm }: { alarm: AlarmInfo | null }) => {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [alarms, setAlarms] = useState({ current: alarm, original: alarm });
  const isModified = useMemo(
    () => JSON.stringify(alarms.current) !== JSON.stringify(alarms.original),
    [alarms]
  );

  useEffect(() => {
    setAlarms({ current: alarm, original: alarm });
  }, [alarm]);

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
    if (!alarms.current) return;
    try {
      await axiosUpdateAlarm(alarms.current);
      // 푸쉬 알림 설정이 변경되었을 경우, 토큰을 요청하거나 삭제합니다.
      if (alarms.current.push) {
        const deviceToken = await requestFcmAndGetDeviceToken();
        await axiosUpdateDeviceToken(deviceToken);
      } else {
        await deleteFcmToken();
        await axiosUpdateDeviceToken(null);
      }
      setAlarms({ current: alarms.current, original: alarms.current });
      setModalTitle("설정이 저장되었습니다");
    } catch (error: any) {
      setAlarms((prev) => ({ ...prev, current: prev.original }));
      setHasErrorOnResponse(true);
      setModalTitle(error.response.data.message);
    } finally {
      setShowResponseModal(true);
    }
  };

  const handleCancel = () => {
    setAlarms((prev) => ({ ...prev, current: prev.original }));
  };

  const handleCloseModal = () => {
    setShowResponseModal(false);
  };

  return (
    <>
      <NotificationCard
        key={JSON.stringify(alarms)}
        alarm={alarms.current ?? { email: false, push: false, slack: false }}
        buttons={
          isModified
            ? [
                {
                  label: "저장",
                  onClick: handleSave,
                  color: "var(--color-background)",
                  backgroundColor: "var(--main-color)",
                  isClickable: true,
                },
                {
                  label: "취소",
                  onClick: handleCancel,
                  isClickable: true,
                },
              ]
            : [
                // NOTE: 이 부분은 레이아웃을 유지하기 위한 placeholder 버튼입니다.
                {
                  label: "-",
                  isClickable: false,
                  color: "var(--gray-tmp-1)",
                  backgroundColor: "var(--gray-tmp-1)",
                },
              ]
        }
        onToggleChange={handleToggleChange}
      />
      <ModalPortal>
        {showResponseModal &&
          (hasErrorOnResponse ? (
            <FailResponseModal
              modalTitle={modalTitle}
              closeModal={handleCloseModal}
            />
          ) : (
            <SuccessResponseModal
              modalTitle={modalTitle}
              closeModal={handleCloseModal}
            />
          ))}
      </ModalPortal>
    </>
  );
};

export default NotificationCardContainer;
