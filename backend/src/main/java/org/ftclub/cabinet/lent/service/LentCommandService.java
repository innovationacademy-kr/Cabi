package org.ftclub.cabinet.lent.service;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LentCommandService {

	private final LentRepository lentRepository;

	public void startLent(Long userId, Long cabinetId, LocalDateTime now,
			LocalDateTime expiredAt) {
		log.info("startLent userId: {}, cabinetId: {}, now: {}, expiredAt: {}",
				userId, cabinetId, now, expiredAt);

		LentHistory lentHistory = LentHistory.of(now, expiredAt, userId, cabinetId);
		lentRepository.save(lentHistory);
	}

	public void startLent(List<Long> userIds, Long cabinetId, LocalDateTime now,
			LocalDateTime expiredAt) {
		log.info("startLent userIds: {}, cabinetId: {}, now: {}, expiredAt: {}",
				userIds, cabinetId, now, expiredAt);

		userIds.forEach(userId -> {
			LentHistory lentHistory = LentHistory.of(now, expiredAt, userId, cabinetId);
			lentRepository.save(lentHistory);
		});
	}

	public void endLent(LentHistory lentHistory, LocalDateTime now) {
		log.info("endLent lentHistory: {}, now: {}", lentHistory, now);

		lentHistory.endLent(now);
		lentRepository.save(lentHistory);
	}

	public void setExpiredAt(LentHistory lentHistory, LocalDateTime expiredAt) {
		log.info("setExpiredAt lentHistory: {}, expiredAt: {}", lentHistory, expiredAt);

		lentHistory.setExpiredAt(expiredAt);
		lentRepository.save(lentHistory);
	}
}
