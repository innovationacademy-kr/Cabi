package org.ftclub.cabinet.lent.newService;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
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

	public void setExpiredAt(LentHistory lentHistory, LocalDateTime expiredAt) {
		lentHistory.setExpiredAt(expiredAt);
	}
}
