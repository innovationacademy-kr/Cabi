package org.ftclub.cabinet.lent.service;

import java.util.List;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.dto.LentHistoryDto;
import org.ftclub.cabinet.dto.LentHistoryPaginationDto;

public interface LentService {

    void startLentCabinet(Long userId, Long cabinetId);

    void startLentClubCabinet(Long userId, Long cabinetId);

    void endLentCabinet(Long userId);

    void terminateLentCabinet(Long userId);

    // 모든 연체된 대여 정보를 가져오는 메소드
    List<LentDto> getAllExpiredLents();

    /* TODO: admin 관련한 read 메서드들 추가 */

    LentHistoryDto getActiveLentInfo();

    List<LentHistoryDto> getAllActiveLentInfo();

    LentHistoryPaginationDto getAllUserLentHistories(Long userId, Integer page, Integer length);

    LentHistoryPaginationDto getAllCabinetLentHistories(Long cabinetId, Integer page,
            Integer length);
}
