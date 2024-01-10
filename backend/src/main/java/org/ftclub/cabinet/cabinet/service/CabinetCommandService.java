package org.ftclub.cabinet.cabinet.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.Grid;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.repository.CabinetRepository;
import org.ftclub.cabinet.exception.DomainException;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.utils.ExceptionUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static org.ftclub.cabinet.cabinet.domain.CabinetStatus.*;
import static org.ftclub.cabinet.exception.ExceptionStatus.INVALID_STATUS;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class CabinetCommandService {
    private static final String EMPTY_STRING = "";

    private final CabinetRepository cabinetRepository;

    /**
     * 사물함의 상태를 전달인자로 받아서 변경합니다.
     *
     * @param cabinet       변경될 사물함 객체
     * @param cabinetStatus 변경할 사물함 상태( AVAILABLE, FULL, BROKEN, LIMITED_AVAILABLE, OVERDUE, PENDING, IN_SESSION )
     */
    public void changeStatus(Cabinet cabinet, CabinetStatus cabinetStatus) {
        cabinet.specifyStatus(cabinetStatus);
        cabinetRepository.save(cabinet);
    }

    /**
     * 사물함의 최대 인원수를 변경합니다.
     *
     * @param cabinet   변경될 사물함 객체
     * @param userCount 변경할 최대 인원수
     */
    public void changeUserCount(Cabinet cabinet, int userCount) {
        if (cabinet.isStatus(BROKEN)) {
            throw new DomainException(INVALID_STATUS);
        }
        if (userCount == 0) {
            cabinet.specifyStatus(CabinetStatus.PENDING);
            cabinet.writeMemo(EMPTY_STRING);
            cabinet.writeTitle(EMPTY_STRING);
        }
        if (userCount == cabinet.getMaxUser()) {
            cabinet.specifyStatus(FULL);
        }
        cabinetRepository.save(cabinet);
    }

    /**
     * 사물함의 제목을 변경합니다.
     *
     * @param cabinet 변경될 사물함
     * @param title   변경할 제목
     */
    public void updateTitle(Cabinet cabinet, String title) {
        cabinet.writeTitle(title);
        cabinetRepository.save(cabinet);
    }

    /**
     * 사물함의 메모를 변경합니다.
     *
     * @param cabinet 변경될 사물함
     * @param memo    변경할 메모
     */
    public void updateMemo(Cabinet cabinet, String memo) {
        cabinet.writeMemo(memo);
        cabinetRepository.save(cabinet);
    }

    /**
     * 여러 개의 사물함 최대 인원수를 한번에 변경합니다.
     *
     * @param cabinets  변경될 사물함 객체 리스트
     * @param userCount 변경할 최대 인원수
     */
    public void changeUserCount(List<Cabinet> cabinets, int userCount) {
        cabinets.forEach(cabinet -> ExceptionUtil.throwIfFalse(!cabinet.isStatus(BROKEN),
                new DomainException(INVALID_STATUS)));
        List<Long> cabinetIds = cabinets.stream()
                .map(Cabinet::getId).collect(Collectors.toList());
        if (userCount == 0) {
            cabinetRepository.updateStatusAndTitleAndMemoByCabinetIdsIn(cabinetIds, PENDING, EMPTY_STRING, EMPTY_STRING);
        } else {
            cabinetRepository.updateStatusByCabinetIdsIn(cabinetIds, FULL);
        }
    }

    /**
     * 사물함 상태 메모를 변경합니다.
     *
     * @param cabinet           변경될 사물함
     * @param changedStatusNote 변경할 상태 메모
     */
    public void changeCabinetStatusNote(Cabinet cabinet, String changedStatusNote) {
        cabinet.writeStatusNote(changedStatusNote);
    }

    /**
     * 사물함의 위치 정보 GRID를 변경합니다
     *
     * @param cabinet     변경될 사물함
     * @param modifedGrid 변경할 GRID
     */
    public void updateGrid(Cabinet cabinet, Grid modifedGrid) {
        cabinet.coordinateGrid(modifedGrid);
    }

    /**
     * 사물함 번호를 변경합니다.
     *
     * @param cabinet    변경될 사물함
     * @param visibleNum 변경할 사물함 번호
     */
    public void updateVisibleNum(Cabinet cabinet, Integer visibleNum) {
        cabinet.assignVisibleNum(visibleNum);
    }

    /**
     * 사물함의 상태를 변경합니다
     *
     * @param cabinet 변경될 사물함
     * @param status  변경할 사물함 상태
     */
    public void updateStatus(Cabinet cabinet, CabinetStatus status) {
        cabinet.specifyStatus(status);
    }

    /**
     * 사물함의 대여타입을 변경합니다.
     *
     * @param cabinet  변경될 사물함
     * @param lentType 변경할 대여 타입
     */

    public void updateLentType(Cabinet cabinet, LentType lentType) {
        cabinet.specifyLentType(lentType);
    }

    /**
     * 동아리 사물함으로 업데이트 합니다
     *
     * @param cabinet    변경될 사물함
     * @param clubName   동아리 이름
     * @param statusNote 상태 메모(동아리 장의 intra id)
     */
    public void updateClubStatus(Cabinet cabinet, String clubName, String statusNote) {
        cabinet.writeTitle(clubName);
        cabinet.writeStatusNote(statusNote);
        cabinet.specifyLentType(LentType.CLUB);
    }
}
