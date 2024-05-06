package org.ftclub.cabinet.user.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
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
@Transactional
@Logging(level = LogLevel.DEBUG)
public class BanHistoryCommandService {

	private final BanHistoryRepository banHistoryRepository;

	private final BanPolicy banPolicy;

	public void banUser(Long userId, LocalDateTime endedAt,
			LocalDateTime unBannedAt, BanType banType) {
		BanHistory banHistory = BanHistory.of(endedAt, unBannedAt, banType, userId);
		banHistoryRepository.save(banHistory);
	}

	public void banUsers(List<Long> userIds, LocalDateTime endedAt,
			LocalDateTime unBannedAt, BanType banType) {
		List<BanHistory> banHistories = userIds.stream()
				.map(userId -> BanHistory.of(endedAt, unBannedAt, banType, userId))
				.collect(Collectors.toList());
		banHistoryRepository.saveAll(banHistories);
	}

	public void deleteRecentBanHistory(BanHistory banHistory, LocalDateTime now) {
		if (banPolicy.isActiveBanHistory(banHistory.getUnbannedAt(), now)) {
			banHistoryRepository.delete(banHistory);
		}
	}

	@Transactional
	public void updateBanDate(BanHistory recentBanHistory, LocalDateTime reducedBanDate) {
		LocalDateTime newUnbannedAt = findMaxUnbannedAt(reducedBanDate, LocalDateTime.now());
		recentBanHistory.updateUnbannedAt(newUnbannedAt);
	}

	private LocalDateTime findMaxUnbannedAt(LocalDateTime reducedBanDate, LocalDateTime now) {
		if (reducedBanDate.isAfter(now)) {
			return reducedBanDate;
		}
		return now;
	}
}
