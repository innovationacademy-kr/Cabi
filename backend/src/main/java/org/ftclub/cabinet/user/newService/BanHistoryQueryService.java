package org.ftclub.cabinet.user.newService;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class BanHistoryQueryService {

    private final BanHistoryRepository banHistoryRepository;

    public BanHistory findRecentActiveBanHistory(Long userId, LocalDateTime now) {
        log.debug("Called findRecentActiveBanHistory: {}", userId);

        List<BanHistory> banHistories = banHistoryRepository.findByUserId(userId);
        return banHistories.stream()
                .filter(history -> history.getUnbannedAt().isAfter(now))
                .sorted(Comparator.comparing(BanHistory::getUnbannedAt, Comparator.reverseOrder()))
                .findFirst()
                .orElse(null);
    }

	public List<BanHistory> findActiveBanHistories(Long userId, LocalDateTime date) {
		log.debug("Called findActiveBanHistories: {}", userId);

		return banHistoryRepository.findByUserIdAndUnbannedAt(userId, date);
	}

	public List<BanHistory> findActiveBanHistories(List<Long> userIds, LocalDateTime date) {
		log.debug("Called findActiveBanHistories: {}", userIds);

		return banHistoryRepository.findByUserIdsAndUnbannedAt(userIds, date);
	}
}
