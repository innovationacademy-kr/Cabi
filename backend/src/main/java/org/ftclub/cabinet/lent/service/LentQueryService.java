package org.ftclub.cabinet.lent.service;

import static java.util.stream.Collectors.toList;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
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

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class LentQueryService {

	private final LentRepository lentRepository;

	public Page<LentHistory> findUserActiveLentHistories(Long userId, Pageable pageable) {
		return lentRepository.findPaginationByUserId(userId, pageable);
	}

	public List<LentHistory> findCabinetActiveLentHistories(Long cabinetId) {
		return lentRepository.findAllByCabinetIdAndEndedAtIsNull(cabinetId);
	}

	public List<LentHistory> findCabinetsActiveLentHistories(List<Long> cabinetIds) {
		return lentRepository.findAllByCabinetIdInAndEndedAtIsNullJoinUser(cabinetIds);
	}

	public int countUserActiveLent(Long userId) {
		return lentRepository.countByUserIdAndEndedAtIsNull(userId);
	}

	public int countCabinetUser(Long cabinetId) {
		return lentRepository.countByCabinetIdAndEndedAtIsNull(cabinetId);
	}

	public int countLentOnDuration(LocalDateTime startDate, LocalDateTime endDate) {
		return lentRepository.countLentFromStartDateToEndDate(startDate, endDate);
	}

	public int countReturnOnDuration(LocalDateTime startDate, LocalDateTime endDate) {
		return lentRepository.countReturnFromStartDateToEndDate(startDate, endDate);
	}

	public LentHistory getUserActiveLentHistoryWithLock(Long userId) {
		return lentRepository.findByUserIdAndEndedAtIsNullForUpdate(userId)
				.orElseThrow(() -> new ServiceException(ExceptionStatus.NOT_FOUND_LENT_HISTORY));
	}

	public List<LentHistory> findUserActiveLentHistoriesInCabinet(Long userId) {
		return lentRepository.findAllByCabinetIdWithSubQuery(userId);
	}

	public List<LentHistory> findUsersActiveLentHistoriesAndCabinet(List<Long> userIds) {
		return lentRepository.findByUserIdsAndEndedAtIsNullJoinCabinet(userIds);
	}

	public List<LentHistory> findAllActiveLentHistories() {
		return lentRepository.findAllByEndedAtIsNull();
	}

	public List<LentHistory> findOverdueLentHistories(LocalDateTime now, Pageable pageable) {
		return lentRepository.findAllExpiredAtBeforeAndEndedAtIsNullJoinUserAndCabinet(now,
						pageable).stream()
				.sorted(Comparator.comparing(LentHistory::getExpiredAt)).collect(toList());
	}

	public List<LentHistory> findAllByCabinetIdsAfterDate(LocalDate date, List<Long> cabinetIds) {
		return lentRepository.findAllByCabinetIdsAfterDate(date, cabinetIds);
	}

	public Page<LentHistory> findAllWithUserAndCabinetByCabinetId(Long cabinetId,
			Pageable pageable) {
		return lentRepository.findPaginationByCabinetIdJoinCabinetAndUser(cabinetId, pageable);
	}
}