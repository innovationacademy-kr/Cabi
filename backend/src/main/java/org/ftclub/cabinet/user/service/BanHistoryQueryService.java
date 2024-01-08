package org.ftclub.cabinet.user.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class BanHistoryQueryService {

	private final BanHistoryRepository banHistoryRepository;

	public Optional<BanHistory> findRecentActiveBanHistory(Long userId, LocalDateTime now) {
		List<BanHistory> banHistories = banHistoryRepository.findByUserId(userId);
		return banHistories.stream()
				.filter(history -> history.getUnbannedAt().isAfter(now))
				.sorted(Comparator.comparing(BanHistory::getUnbannedAt, Comparator.reverseOrder()))
				.findFirst();
	}

	public List<BanHistory> findActiveBanHistories(Long userId, LocalDateTime date) {
		return banHistoryRepository.findByUserIdAndUnbannedAt(userId, date);
	}

	public List<BanHistory> findActiveBanHistories(List<Long> userIds, LocalDateTime date) {
		return banHistoryRepository.findByUserIdsAndUnbannedAt(userIds, date);
	}

	public Page<BanHistory> findActiveBanHistories(LocalDateTime now, Pageable pageable) {
		return banHistoryRepository.findPaginationActiveBanHistoriesJoinUser(pageable, now);
	}
}
