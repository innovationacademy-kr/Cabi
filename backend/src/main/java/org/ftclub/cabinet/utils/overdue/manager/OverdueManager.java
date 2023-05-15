package org.ftclub.cabinet.utils.overdue.manager;


import org.ftclub.cabinet.dto.LentHistoryWithNameExpiredAtDto;

/**
 * 연체 처리를 위한 인터페이스
 */
public interface OverdueManager {

    /**
     * 연체 메일의 제목을 반환하는 메소드
     *
     * @return 연체 메일의 제목
     */
    String getOverdueMailSubject();

    /**
     * 연체 메일의 템플릿 URL을 반환하는 메소드
     *
     * @return 연체 메일의 템플릿 URL
     */
    String getOverdueMailTemplateUrl();

    /**
     * 연체 기한이 곧 임박하였음을 알리는 메일의 제목을 반환하는 메소드
     *
     * @return 연체 기한이 곧 임박하였음을 알리는 메일의 제목
     */
    String getSoonOverdueMailSubject();

    /**
     * 연체 기한이 곧 임박하였음을 알리는 메일의 템플릿 URL을 반환하는 메소드
     *
     * @return 연체 기한이 곧 임박하였음을 알리는 메일의 템플릿 URL
     */
    String getSoonOverdueMailTemplateUrl();

    /**
     * 연체기한이 곧 임박하였음을 알리는 기준일을 반환하는 메소드
     */
    Long getSoonOverdueTerm();

    /**
     * 연체된 대여에 대한 처리를 위한 메소드
     *
     * @param lent - 유저의 대여 정보
     */
    void handleOverdue(LentHistoryWithNameExpiredAtDto lent);
}
