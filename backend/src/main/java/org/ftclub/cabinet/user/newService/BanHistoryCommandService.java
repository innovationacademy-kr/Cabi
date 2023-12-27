package org.ftclub.cabinet.user.newService;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanPolicy;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class BanHistoryCommandService {

	private final BanHistoryRepository banHistoryRepository;

	private final BanPolicy banPolicy;

	public void banUser(Long userId, LocalDateTime endedAt,
			LocalDateTime unBannedAt, BanType banType) {
		BanHistory banHistory = BanHistory.of(endedAt, unBannedAt, banType, userId);
		banHistoryRepository.save(banHistory);
	}

	public void deleteRecentBanHistory(BanHistory banHistory, LocalDateTime now) {
		if (banPolicy.isActiveBanHistory(banHistory.getUnbannedAt(), now)) {
			banHistoryRepository.delete(banHistory);
		}
	}
}
