package org.ftclub.cabinet.utils.overdue.checker;

import org.ftclub.cabinet.dto.LentHistoryDto;

/**
 * 연체 처리를 위한 인터페이스
 */
public interface OverdueChecker {

    /**
     * 연체기한이 곧 임박하였음을 알리는 기준일을 반환하는 메소드
     */
    public Integer getSoonOverdueTerm();

    /**
     * 연체기한이 지났음을 알리는 기준일을 반환하는 메소드
     */
    public Integer getOverdueTerm();

    /**
     * 연체된 대여물품에 대한 처리를 위한 메소드
     *
     * @param lent - 유저의 대여 정보
     */
    public void handleOverdue(LentHistoryDto lent);
}
