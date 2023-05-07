package org.ftclub.cabinet.utils.leave.absence;

import org.ftclub.cabinet.dto.UserDto;

public interface LeaveAbsenceManager {

    /**
     * 휴학생인지 확인하는 메소드
     * @param name - 유저의 이름
     * @return
     */
    public Boolean checkLeaveAbsence(String name);

    /**
     * 휴학생이라면 휴학생 처리하는 메소드
     * @param user - 유저의 정보
     */
    public void handleLeaveAbsence(UserDto user);
}
