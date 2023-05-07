package org.ftclub.cabinet.utils.expired.checker;

import java.util.Date;
import org.ftclub.cabinet.dto.LentDto;

public interface ExpiredChecker {
    /**
     * 대여기한이 만료되었는지 확인하는 메소드
     *
     * @param expiredAt - 대여기간 만료일
     */
    public Boolean checkExpired(Date expiredAt);

    /**
     * 연체된 대여물품에 대한 처리를 위한 메소드
     * @param lentDto - 유저의 대여 정보
     */
    public void handleExpired(LentDto lentDto);
}
