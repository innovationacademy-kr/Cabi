package org.ftclub.cabinet.club.service;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.Club;
import org.ftclub.cabinet.club.repository.ClubRepository;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ClubQueryService {

	private final ClubRepository clubRepository;

	/**
	 * 모든 동아리 목록을 조회한다.
	 *
	 * @param pageable 페이징 정보
	 * @return 모든 동아리 목록
	 */
	public Page<Club> findAllActiveClubs(Pageable pageable) {
		return clubRepository.findPaginationByDeletedAtIsNull(pageable);
	}

	/**
	 * 특정 동아리 정보를 조회한다.
	 *
	 * @param clubId 동아리 ID
	 * @return 동아리 정보
	 */
	public Club getClub(Long clubId) {
		Optional<Club> club = clubRepository.findById(clubId);
		return club.orElseThrow(ExceptionStatus.NOT_FOUND_CLUB::asServiceException);
	}

	/**
	 * 특정 동아리 정보를 조회한다.
	 * <p>
	 * ClubRegistration도 Join 연산으로 함께 조회한다.
	 * </p>
	 *
	 * @param clubId 동아리 ID
	 * @return 동아리 정보
	 */
	public Club getClubWithClubRegistration(Long clubId) {
		Optional<Club> club = clubRepository.findByIdAndDeletedAtIsNull(clubId);
		return club.orElseThrow(ExceptionStatus.NOT_FOUND_CLUB::asServiceException);
	}
}
