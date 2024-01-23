package org.ftclub.cabinet.club.service;

import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.Club;
import org.ftclub.cabinet.club.repository.ClubRepository;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ClubCommandService {

	private final ClubRepository clubRepository;

	/**
	 * 동아리를 생성한다.
	 *
	 * @param clubName 동아리 이름
	 * @return 생성된 동아리
	 */
	public Club createClub(String clubName) {
		Club club = Club.of(clubName);
		return clubRepository.save(club);
	}

	/**
	 * 동아리를 삭제한다.
	 *
	 * @param club 동아리
	 */
	public void deleteClub(Club club) {
		club.disable();
		clubRepository.save(club);
	}

	/**
	 * 동아리 이름을 변경한다.
	 *
	 * @param club     동아리
	 * @param clubName 동아리 이름
	 */
	public void updateName(Club club, String clubName) {
		club.changeClubName(clubName);
		clubRepository.save(club);
	}

}
