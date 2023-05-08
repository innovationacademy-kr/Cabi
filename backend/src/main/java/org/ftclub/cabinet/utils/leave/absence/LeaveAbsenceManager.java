package org.ftclub.cabinet.utils.leave.absence;

import org.ftclub.cabinet.dto.LentHistoryDto;

/**
 * 휴학생을 관리하기 위한 인터페이스
 */
public interface LeaveAbsenceManager {

    /**
     * 휴학생인지 확인하는 메소드
     *
     * @param name - 유저의 이름
     * @return
     */
    public Boolean checkLeaveAbsence(String name);

    /**
     * 휴학생이라면 휴학생 처리하는 메소드
     *
     * @param lent - 유저의 대여 정보
     */
    public void handleLeaveAbsence(LentHistoryDto lent);
}
