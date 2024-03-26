package org.ftclub.cabinet.lent.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.ClubLentHistory;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.lent.repository.ClubLentRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ClubLentQueryService {

	private final ClubLentRepository clubLentRepository;

	public void findAlreadyExistsClubLentHistory(Long clubId) {
		clubLentRepository.findByClubIdAndEndedAtIsNull(clubId).ifPresent(clubLentHistory -> {
			throw ExceptionStatus.LENT_ALREADY_EXISTED.asServiceException();
		});
	}

	public ClubLentHistory findActiveLentHistoryWithClub(Long cabinetId) {
		return clubLentRepository.findByCabinetIdAndEndedAtIsNullJoinClub(cabinetId)
				.orElse(null);
	}

	public ClubLentHistory getActiveLentHistoryWithCabinet(Long clubId) {
		return clubLentRepository.findByEndedAtIsNullJoinCabinet(clubId)
				.orElseThrow(ExceptionStatus.NOT_FOUND_CLUB_LENT_HISTORY::asServiceException);
	}

	public List<ClubLentHistory> findAllActiveLentHistoriesWithClub() {
		return clubLentRepository.findAllByEndedAtIsNullJoinClub();
	}

	public List<ClubLentHistory> getAllActiveClubLentHistoriesWithCabinets(List<Long> cabinetIds) {
		return clubLentRepository.findByEndedAtIsNullJoinCabinets(cabinetIds)
				.orElseThrow(ExceptionStatus.NOT_FOUND_CLUB_LENT_HISTORY::asServiceException);
	}

	public ClubLentHistory getClubActiveLentHistory(Long clubId, Long cabinetId) {
		return clubLentRepository.findByClubIdAndCabinetIdAndEndedAtIsNull(clubId, cabinetId)
				.orElseThrow(ExceptionStatus.NOT_FOUND_CLUB_LENT_HISTORY::asServiceException);
	}
}
