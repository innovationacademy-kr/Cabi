package org.ftclub.cabinet.lent.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class LentQueryService {

    private final LentRepository lentRepository;


    /**
     * 유저가 지금까지 빌렸던 사물함의 대여 기록을 가져옵니다.
     *
     * @param userId   찾으려는 user id
     * @param pageable 페이징 정보
     * @return 유저가 빌렸던 사물함의 대여 기록 {@link Page}
     */
    public Page<LentHistory> findUserLentHistories(Long userId, Pageable pageable) {
        return lentRepository.findPaginationByUserId(userId, pageable);
    }

    /**
     * 유저가 지금 대여하고 있는 사물함의 대여 기록을 가져옵니다.
     * <p>
     * 사물함 정보를 Join 하여 함께 가져옵니다.
     *
     * @param userId 찾으려는 user id
     * @return 유저가 대여하고 있는 사물함의 대여 기록
     */
    public LentHistory findUserActiveLentHistoryAndCabinet(Long userId) {
        return lentRepository.findByUserIdAndEndedAtIsNullJoinCabinet(userId)
                .orElse(null);
    }

    /**
     * 사물함의 현재 대여 중인 대여 기록을 가져옵니다.
     *
     * @param cabinetId 찾으려는 cabinet id
     * @return 사물함의 현재 대여 중인 대여 기록 {@link List}
     */
    public List<LentHistory> findCabinetActiveLentHistories(Long cabinetId) {
        return lentRepository.findAllByCabinetIdAndEndedAtIsNull(cabinetId);
    }

    /**
     * 여러 사물함의 현재 대여 중인 대여 기록을 가져옵니다.
     * <p>
     * 유저 정보를 Join 하여 함께 가져옵니다.
     *
     * @param cabinetIds 찾으려는 cabinet id {@link List}
     * @return 사물함의 현재 대여 중인 대여 기록 {@link List}
     */
    public List<LentHistory> findCabinetsActiveLentHistories(List<Long> cabinetIds) {
        return lentRepository.findAllByCabinetIdInAndEndedAtIsNullJoinUser(cabinetIds);
    }

    /**
     * 유저가 지금 빌리고 있는 사물함의 개수를 가져옵니다.
     *
     * @param userId 찾으려는 user id
     * @return 유저가 빌리고 있는 사물함의 개수
     */
    public int countUserActiveLent(Long userId) {
        return lentRepository.countByUserIdAndEndedAtIsNull(userId);
    }

    /**
     * 사물함의 현재 대여 중인 대여 기록의 개수를 가져옵니다.
     *
     * @param cabinetId 찾으려는 cabinet id
     * @return 사물함의 현재 대여 중인 대여 기록의 개수
     */
    public int countCabinetUser(Long cabinetId) {
        return lentRepository.countByCabinetIdAndEndedAtIsNull(cabinetId);
    }

    /**
     * 특정 기간에 새로 빌린 대여 기록의 개수를 가져옵니다.
     *
     * @param startDate 시작 날짜
     * @param endDate   끝 날짜
     * @return 특정 기간에 있었던 대여 기록의 개수
     */
    public int countLentOnDuration(LocalDateTime startDate, LocalDateTime endDate) {
        return lentRepository.countLentFromStartDateToEndDate(startDate, endDate);
    }

    /**
     * 특정 기간에 반납된 대여 기록의 개수를 가져옵니다.
     *
     * @param startDate 시작 날짜
     * @param endDate   끝 날짜
     * @return 특정 기간에 반납된 대여 기록의 개수
     */
    public int countReturnOnDuration(LocalDateTime startDate, LocalDateTime endDate) {
        return lentRepository.countReturnFromStartDateToEndDate(startDate, endDate);
    }

    /**
     * 유저가 지금 빌리고 있는 사물함의 대여 기록을 가져옵니다.
     *
     * @param userId 찾으려는 user id
     * @return 유저가 빌리고 있는 사물함의 대여 기록
     * @throws ServiceException 대여 기록이 없을 경우
     */
    public LentHistory getUserActiveLentHistoryWithLock(Long userId) {
        return lentRepository.findByUserIdAndEndedAtIsNullForUpdate(userId)
                .orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_LENT_HISTORY));
    }

    /**
     * 유저가 대여 중인 사물함의 현재 대여 중인 대여 기록을 가져옵니다.
     * <p>
     * X Lock을 걸어서 가져오며, subQuery를 사용하여 가져옵니다.
     *
     * @param userId 찾으려는 user id
     * @return 유저가 대여 중인 사물함의 현재 대여 중인 대여 기록 {@link List}
     */
    public List<LentHistory> findUserActiveLentHistoriesInCabinetWithXLock(Long userId) {
        return lentRepository.findAllByCabinetIdWithSubQueryForUpdate(userId);
    }

    /**
     * 유저가 대여 중인 사물함의 현재 대여 중인 대여 기록을 가져옵니다.
     * <p>
     * 사물함을 Join하여 가져옵니다.
     *
     * @param userIds 찾으려는 user id {@link List}
     * @return 유저가 대여 중인 사물함의 현재 대여 중인 대여 기록 {@link List}
     */
    public List<LentHistory> findUsersActiveLentHistoriesWithCabinet(List<Long> userIds) {
        return lentRepository.findByUserIdsAndEndedAtIsNullJoinCabinet(userIds);
    }

    /**
     * 현재 대여 중인 모든 대여 기록을 가져옵니다.
     * <p>
     * 유저와 사물함을 Join하여 가져옵니다.
     *
     * @return 현재 대여 중인 모든 대여 기록 {@link List}
     */
    public List<LentHistory> findAllActiveLentHistoriesWithCabinetAndUser() {
        return lentRepository.findAllByEndedAtIsNullJoinCabinetAndUser();
    }

    /**
     * 현재 시간을 기준으로 반납 기한이 지난 대여 기록을 가져옵니다.
     *
     * @param now      현재 시간
     * @param pageable 페이징 정보
     * @return 반납 기한이 지난 대여 기록 {@link List}
     */
    public List<LentHistory> findOverdueLentHistories(LocalDateTime now, Pageable pageable) {
        return lentRepository.findAllExpiredAtBeforeAndEndedAtIsNullJoinUserAndCabinet(now,
                        pageable).stream()
                .sorted(Comparator.comparing(LentHistory::getExpiredAt)).collect(toList());
    }

    /**
     * 여러 사물함에서 기준 날짜보다 반납 기한이 나중인 대여 기록을 가져옵니다.
     *
     * @param date       날짜
     * @param cabinetIds 찾으려는 cabinet id {@link List}
     * @return 기준 날짜보다 반납 기한이 나중인 대여 기록 {@link List}
     */
    public List<LentHistory> findAllByCabinetIdsAfterDate(LocalDate date, List<Long> cabinetIds) {
        return lentRepository.findAllByCabinetIdsEndedAtAfterDate(date, cabinetIds);
    }

    /**
     * 사물함의 현재 대여 중인 대여 기록을 가져옵니다.
     * <p>
     * 사물함과 유저 정보를 Join하여 함께 가져옵니다.
     *
     * @param cabinetId 찾으려는 cabinet id
     * @param pageable  페이징 정보
     * @return 사물함의 현재 대여 중인 대여 기록 {@link Page}
     */
    public Page<LentHistory> findCabinetLentHistoriesWithUserAndCabinet(Long cabinetId,
                                                                        Pageable pageable) {
        return lentRepository.findPaginationByCabinetIdJoinCabinetAndUser(cabinetId, pageable);
    }
}
