package org.ftclub.cabinet.club.repository;

import io.lettuce.core.dynamic.annotation.Param;
import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.ftclub.cabinet.user.domain.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRegistrationRepoitory extends JpaRepository<ClubRegistration, Long> {

	List<ClubRegistration> findAllByClubId(@Param("clubId") Long clubId);

	Optional<ClubRegistration> findByUserId(@Param("userId") Long userId);

	/**
	 * 특정 유저가 속한 동아리 목록을 조회한다.
	 * <p>
	 * Club도 Join 연산으로 함께 조회한다.
	 * </p>
	 *
	 * @param userId
	 * @return
	 */
	@Query("SELECT cr "
			+ "FROM ClubRegistration cr "
			+ "LEFT JOIN FETCH cr.club "
			+ "WHERE cr.userId = :userId")
	List<ClubRegistration> findAllByUserIdJoinClub(@Param("userId") Long userId);

	/**
	 * 특정 동아리 목록에 속한 동아리 회원 목록을 조회한다.
	 * <p>
	 * User도 Join 연산으로 함께 조회한다.
	 * </p>
	 *
	 * @param clubIds 동아리 ID 목록
	 * @return 동아리 회원 목록
	 */
	@Query("SELECT cr "
			+ "FROM ClubRegistration cr "
			+ "LEFT JOIN FETCH cr.user "
			+ "WHERE cr.clubId IN :clubIds")
	List<ClubRegistration> findAllByClubIdInJoinUser(List<Long> clubIds);

	/**
	 * 특정 동아리의 특정 유저의 동아리 회원 정보를 조회한다.
	 *
	 * @param clubId 동아리 ID
	 * @param userId 유저 ID
	 * @return 동아리 회원 정보
	 */
	@Query("SELECT cr "
			+ "FROM ClubRegistration cr "
			+ "WHERE cr.clubId = :clubId AND cr.userId = :userId")
	Optional<ClubRegistration> findByClubIdAndUserId(@Param("clubId") Long clubId,
			@Param("userId") Long userId);

	/**
	 * 특정 동아리의 동아리장 정보를 조회한다.
	 * <p>
	 * User도 Join 연산으로 함께 조회한다.
	 * </p>
	 *
	 * @param clubId   동아리 ID
	 * @param userRole 유저 동아리 권한
	 * @return 동아리 회원 정보
	 */
	@Query("SELECT cr "
			+ "FROM ClubRegistration cr "
			+ "LEFT JOIN FETCH cr.user "
			+ "WHERE cr.clubId = :clubId AND cr.userRole = :userRole")
	Optional<ClubRegistration> findByClubIdAndUserRoleJoinUser(
			@Param("clubId") Long clubId, @Param("userRole") UserRole userRole);
}
