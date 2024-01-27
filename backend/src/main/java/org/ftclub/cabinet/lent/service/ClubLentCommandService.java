package org.ftclub.cabinet.lent.service;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.ClubLentHistory;
import org.ftclub.cabinet.lent.repository.ClubLentRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ClubLentCommandService {

	private final ClubLentRepository clubLentRepository;

	public void startLent(Long clubId, Long cabinetId, LocalDateTime expiredAt) {
		ClubLentHistory clubLent = ClubLentHistory.of(clubId, cabinetId, expiredAt);
		clubLentRepository.save(clubLent);
	}

	public void endLent(ClubLentHistory clubLentHistory, LocalDateTime now) {
		clubLentHistory.endLent(now);
	}
}
