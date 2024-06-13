package org.ftclub.cabinet.club.service;


import static org.ftclub.cabinet.club.domain.UserRole.CLUB_ADMIN;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.ftclub.cabinet.club.repository.ClubRegistrationRepoitory;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Logging(level = LogLevel.DEBUG)
public class ClubRegistrationQueryService {

	private final ClubRegistrationRepoitory clubRegistrationRepoitory;

	/**
	 * 특정 동아리에 속한 동아리 회원 목록을 조회한다.
	 *
	 * @param clubId 동아리 ID
	 * @return 동아리 회원 목록
	 */
	public List<ClubRegistration> findClubUsersByClub(Long clubId) {
		return clubRegistrationRepoitory.findAllByClubIdAndDeletedAtIsNull(clubId);
	}

	/**
	 * 특정 유저가 속한 동아리 목록을 조회한다.
	 *
	 * @param userId 유저 ID
	 * @return 동아리 회원 목록
	 */
	public ClubRegistration getClubUserByUser(Long userId, Long clubId) {
		Optional<ClubRegistration> clubRegistration =
				clubRegistrationRepoitory.findByUserIdAndClubIdAndDeletedAtIsNull(userId, clubId);
		return clubRegistration.orElseThrow(ExceptionStatus.NOT_CLUB_USER::asServiceException);
	}

	/**
	 * 특정 유저가 속한 동아리 목록을 조회한다.
	 * <p>
	 * Club도 Join 연산으로 함께 조회한다.
	 * </p>
	 *
	 * @param userId 유저 ID
	 * @return 동아리 회원 목록
	 */
	public List<ClubRegistration> findClubUsersWithClubByUser(Long userId) {
		return clubRegistrationRepoitory.findAllByUserIdJoinClub(userId);
	}

	/**
	 * 특정 동아리에 속한 동아리 회원 목록을 조회한다.
	 * <p>
	 * User도 Join 연산으로 함께 조회한다.
	 * </p>
	 *
	 * @param clubIds 동아리 ID 목록
	 * @return 동아리 회원 목록
	 */
	public List<ClubRegistration> findClubUsersByClubs(List<Long> clubIds) {
		return clubRegistrationRepoitory.findAllByClubIdInJoinUser(clubIds);
	}

	/**
	 * 특정 유저가 속한 특정 동아리의 동아리 회원 정보를 조회한다.
	 *
	 * @param userId 유저 ID
	 * @param clubId 동아리 ID
	 * @return 동아리 회원 목록
	 */
	public ClubRegistration getClubUser(Long userId, Long clubId) {
		return clubRegistrationRepoitory.findByClubIdAndUserId(clubId, userId)
				.orElseThrow(ExceptionStatus.NOT_CLUB_USER::asServiceException);
	}

	/**
	 * 특정 동아리의 동아리장 회원 정보를 조회한다.
	 * <p>
	 * User도 Join 연산으로 함께 조회한다.
	 * </p>
	 *
	 * @param clubId 동아리 ID
	 * @return 동아리 회원 목록
	 */
	public ClubRegistration getClubMasterByClubWithUser(Long clubId) {
		return clubRegistrationRepoitory.findByClubIdAndUserRoleJoinUser(clubId, CLUB_ADMIN)
				.orElseThrow(ExceptionStatus.NOT_CLUB_MASTER::asServiceException);
	}
}
