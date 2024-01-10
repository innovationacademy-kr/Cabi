package org.ftclub.cabinet.lent.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class LentCommandService {

	private final LentRepository lentRepository;


	/**
	 * 유저가 사물함에 대한 대여를 시작합니다.
	 * <p>
	 * 개인 사물함 대여 시 사용합니다.
	 *
	 * @param userId    대여하려는 user id
	 * @param cabinetId 대여하려는 cabinet id
	 * @param now       현재 시간
	 * @param expiredAt 만료 시간
	 */
	public void startLent(Long userId, Long cabinetId, LocalDateTime now, LocalDateTime expiredAt) {
		LentHistory lentHistory = LentHistory.of(now, expiredAt, userId, cabinetId);
		lentRepository.save(lentHistory);
	}

	/**
	 * 유저들이 사물함에 대한 대여를 시작합니다.
	 * <p>
	 * 공유 사물함 대여 시 사용합니다.
	 *
	 * @param userIds   대여하려는 유저들의 user id {@link List}
	 * @param cabinetId 대여하려는 cabinet id
	 * @param now       현재 시간
	 * @param expiredAt 만료 시간
	 */
	public void startLent(List<Long> userIds, Long cabinetId, LocalDateTime now,
			LocalDateTime expiredAt) {
		userIds.forEach(userId -> {
			LentHistory lentHistory = LentHistory.of(now, expiredAt, userId, cabinetId);
			lentRepository.save(lentHistory);
		});
	}

	/**
	 * 대여 기록을 기준으로 대여한 사물함을 반납합니다.
	 *
	 * @param lentHistory 반납하려는 대여 기록
	 * @param now         현재 시간
	 */
	public void endLent(LentHistory lentHistory, LocalDateTime now) {
		lentHistory.endLent(now);
	}

	/**
	 * 여러 대여 기록을 기준으로 대여한 사물함을 반납합니다.
	 *
	 * @param lentHistories 반납하려는 대여 기록 {@link List}
	 * @param now           현재 시간
	 */
	public void endLent(List<LentHistory> lentHistories, LocalDateTime now) {
		lentHistories.forEach(lentHistory -> lentHistory.isEndLentValid(now));
		List<Long> userIds = lentHistories.stream()
				.map(LentHistory::getUserId).collect(Collectors.toList());
		lentRepository.updateEndedAtByUserIdIn(userIds, now);
	}

	/**
	 * 여러 대여 기록의 만료 시간을 설정합니다.
	 *
	 * @param lentHistoryIds 대여 기록 id {@link List}
	 * @param expiredAt      만료 시간
	 */
	public void setExpiredAt(List<Long> lentHistoryIds, LocalDateTime expiredAt) {
		lentRepository.updateExpiredAtByIdIn(lentHistoryIds, expiredAt);
	}
}
