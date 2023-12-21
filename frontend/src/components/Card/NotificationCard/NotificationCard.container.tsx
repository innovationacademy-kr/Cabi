import { useEffect, useState } from "react";
import { set } from "react-ga";
import NotificationCard from "@/components/Card/NotificationCard/NotificationCard";
import ModalPortal from "@/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import { AlarmInfo } from "@/types/dto/alarm.dto";
import { axiosUpdateAlarm } from "@/api/axios/axios.custom";

const NotificationCardContainer = ({ alarm }: { alarm: AlarmInfo | null }) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [currentAlarms, setCurrentAlarms] = useState<AlarmInfo | null>(alarm);
  const [originalAlarms, setOriginalAlarms] = useState<AlarmInfo | null>(alarm);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [forceRender, setForceRender] = useState<number>(0);

  useEffect(() => {
    setCurrentAlarms(alarm);
    setOriginalAlarms(alarm);
  }, [alarm]);

  const handleToggleChange = (newSetting: AlarmInfo) => {
    setCurrentAlarms(newSetting);
    if (JSON.stringify(newSetting) === JSON.stringify(originalAlarms)) {
      setIsModified(false);
    } else {
      setIsModified(true);
    }
  };

  const handleSave = async () => {
    if (!currentAlarms) return;
    try {
      await axiosUpdateAlarm({
        email: currentAlarms.email,
        push: currentAlarms.push,
        slack: currentAlarms.slack,
      });
      setOriginalAlarms(currentAlarms);
      setModalTitle("설정이 저장되었습니다");
    } catch (error: any) {
      setCurrentAlarms(originalAlarms);
      setForceRender((prev) => prev + 1);
      setHasErrorOnResponse(true);
      setModalTitle(error.response.data.message);
    } finally {
      setShowResponseModal(true);
      setIsModified(false);
    }
  };

  const handleCancel = () => {
    setCurrentAlarms(originalAlarms);
    setIsModified(false);
    setForceRender((prev) => prev + 1);
  };

  const handleCloseModal = () => {
    setShowResponseModal(false);
  };

  return (
    <>
      <NotificationCard
        key={forceRender}
        alarm={currentAlarms}
        buttons={
          isModified
            ? [
                {
                  label: "저장",
                  onClick: handleSave,
                  color: "var(--white)",
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
                  color: "var(--lightgray-color)",
                  backgroundColor: "var(--lightgray-color)",
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
