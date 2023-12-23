package org.ftclub.cabinet.user.newService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanPolicy;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Log4j2
public class BanHistoryCommandService {

	private final BanHistoryRepository banHistoryRepository;

	private final BanPolicy banPolicy;

	public void banUser(Long userId, LocalDateTime endedAt,
	                    LocalDateTime unBannedAt, BanType banType) {
		BanHistory banHistory = BanHistory.of(endedAt, unBannedAt, banType, userId);
		banHistoryRepository.save(banHistory);
	}

	public void deleteRecentBanHistory(BanHistory banHistory, LocalDateTime now) {
		log.debug("Called deleteRecentBanHistory: {}", banHistory);
		if (banPolicy.isActiveBanHistory(banHistory.getUnbannedAt(), now)) {
			banHistoryRepository.delete(banHistory);
		}
	}
}
