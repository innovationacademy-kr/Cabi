package org.ftclub.cabinet.lent.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.ClubLentHistory;
import org.ftclub.cabinet.lent.repository.ClubLentRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ClubLentQueryService {

	private final ClubLentRepository clubLentRepository;

	public List<ClubLentHistory> findAllActiveLentHistories() {
		return clubLentRepository.findAllByEndedAtIsNullWithClub();
	}

	public ClubLentHistory findActiveLentHistoryWithClub(Long cabinetId) {
		return clubLentRepository.findByCabinetIdAndEndedAtIsNullWithClub(cabinetId)
				.orElse(null);
	}
}
