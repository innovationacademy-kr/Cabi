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

	public void startLent(Long userId, Long cabinetId, LocalDateTime now,
			LocalDateTime expiredAt) {
		LentHistory lentHistory = LentHistory.of(now, expiredAt, userId, cabinetId);
		lentRepository.save(lentHistory);
	}

	public void startLent(List<Long> userIds, Long cabinetId, LocalDateTime now,
			LocalDateTime expiredAt) {
		userIds.forEach(userId -> {
			LentHistory lentHistory = LentHistory.of(now, expiredAt, userId, cabinetId);
			lentRepository.save(lentHistory);
		});
	}

	public void endLent(LentHistory lentHistory, LocalDateTime now) {
		lentHistory.endLent(now);
		lentRepository.save(lentHistory);
	}

	public void endLent(List<LentHistory> lentHistories, LocalDateTime now) {
		lentHistories.forEach(lentHistory -> lentHistory.isEndLentValid(now));
		List<Long> userIds = lentHistories.stream()
				.map(LentHistory::getUserId).collect(Collectors.toList());
		lentRepository.updateEndedAtByUserIdIn(userIds, now);
	}

	public void setExpiredAt(LentHistory lentHistory, LocalDateTime expiredAt) {
		lentHistory.setExpiredAt(expiredAt);
		lentRepository.save(lentHistory);
	}
}