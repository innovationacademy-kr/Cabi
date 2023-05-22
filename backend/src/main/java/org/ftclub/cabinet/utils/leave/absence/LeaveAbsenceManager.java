package org.ftclub.cabinet.utils.leave.absence;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * 휴학생을 관리하기 위한 인터페이스
 */
public interface LeaveAbsenceManager {

    /**
     * 휴학생인지 확인하는 메소드
     *
     * @param jsonUserInfo - 인트라로 응답받은 유저 정보
     * @return 휴학생이라면 true, 아니라면 false
     */
    Boolean isLeaveAbsence(JsonNode jsonUserInfo);

    /**
     * 휴학생이라면 휴학생 처리하는 메소드
     *
     * @param userId - 유저의 아이디
     * @param name   - 유저의 이름
     */
    void handleLeaveAbsence(Long userId, String name);
}
