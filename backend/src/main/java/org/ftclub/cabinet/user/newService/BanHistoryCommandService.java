package org.ftclub.cabinet.user.newService;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class BanHistoryCommandService {

	private final BanHistoryRepository banHistoryRepository;

	public void banUser(Long userId, LocalDateTime endedAt,
			LocalDateTime unBannedAt, BanType banType) {
		BanHistory banHistory = BanHistory.of(endedAt, unBannedAt, banType, userId);
		banHistoryRepository.save(banHistory);
	}
}
