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

	public Club getClub(Long clubId) {
		Optional<Club> club = clubRepository.findById(clubId);
		return club.orElseThrow(ExceptionStatus.NOT_FOUND_CLUB::asServiceException);
	}

	public Page<Club> findAll(Pageable pageable) {
		return clubRepository.findAll(pageable);
	}
}
