package org.ftclub.cabinet.user.newService;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class BanHistoryQueryService {

	private final BanHistoryRepository banHistoryRepository;

//	public BanHistory findRecentActiveBanHistory(Long userId, LocalDateTime now) {
//		log.debug("Called findRecentActiveBanHistory: {}", userId);
//
//		List<BanHistory> banHistories = banHistoryRepository.findAll();
//
//	}

	public List<BanHistory> findActiveBanHistories(Long userId, LocalDateTime date) {
		log.debug("Called findActiveBanHistories: {}", userId);

		return banHistoryRepository.findByUserIdAndUnbannedAt(userId, date);
	}

	public List<BanHistory> findActiveBanHistories(List<Long> userIds, LocalDateTime date) {
		log.debug("Called findActiveBanHistories: {}", userIds);

		return banHistoryRepository.findByUserIdsAndUnbannedAt(userIds, date);
	}
}
