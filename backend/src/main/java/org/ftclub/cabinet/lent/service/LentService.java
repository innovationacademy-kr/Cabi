package org.ftclub.cabinet.lent.service;

import java.util.List;
import org.ftclub.cabinet.dto.LentHistoryWithNameExpirationDto;

/**
 * 대여 관련된 서비스
 */
public interface LentService {

    /**
     * 사물함 대여를 합니다.
     *
     * @param userId    대여하려는 일반 user id
     * @param cabinetId 대여하려는 cabinet id
     */
    void startLentCabinet(Long userId, Long cabinetId);

    /**
     * 동아리 사물함 대여를 합니다.
     *
     * @param userId    대여하려는 동아리 user id
     * @param cabinetId 대여하려는 동아리 cabinet id
     */
    void startLentClubCabinet(Long userId, Long cabinetId);

    /**
     * 사물함을 반납 합니다. 유저가 정책에 따라 벤이 될 수 있습니다.
     *
     * @param userId 반납하려는 user id
     */
    void endLentCabinet(Long userId);

    /**
     * 사물함을 강제 반납 합니다. 유저가 벤이 되진 않습니다
     *
     * @param userId 반납하려는 user id
     */
    void terminateLentCabinet(Long userId);

    /**
     * 모든 유저의 대여 정보를 가져옵니다. 연체 정보도 함께 가져옵니다.
     *
     * @return 모든 유저의 대여 정보
     */
    List<LentHistoryWithNameExpirationDto> getAllLentHistoryWithNameExpiration();
}
