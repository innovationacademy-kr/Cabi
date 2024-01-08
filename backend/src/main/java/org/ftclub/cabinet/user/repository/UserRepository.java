package org.ftclub.cabinet.user.repository;

import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	/**
	 * 유저 고유 아이디로 유저를 가져옵니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @return {@link User}
	 */
	@Query("SELECT u FROM User u WHERE u.id = :userId AND u.deletedAt IS NULL")
	Optional<User> findById(@Param("userId") Long userId);

	@Query("SELECT u FROM User u WHERE u.id = :userId AND u.role = :role AND u.deletedAt IS NULL")
	Optional<User> findByIdAndRole(Long userId, UserRole role);

	/**
	 * 유저 이름으로 유저를 찾습니다.
	 *
	 * @param name 유저 이름
	 * @return {@link User}
	 */
	@Query("SELECT u FROM User u WHERE u.name = :name")
	Optional<User> findByName(@Param("name") String name);

	/**
	 * 유저의 이메일로 유저를 찾습니다.
	 *
	 * @param email 유저 이메일
	 * @return {@link User}
	 */
	@Query("SELECT u FROM User u WHERE u.email = :email")
	Optional<User> findByEmail(@Param("email") String email);

	/**
	 * 유저의 이름 일부분으로 유저를 찾습니다.
	 *
	 * @param name     유저 이름 일부분
	 * @param pageable 페이징 정보
	 * @return {@link User} 리스트
	 */
	@Query("SELECT u FROM User u WHERE u.name LIKE %:name%")
	Page<User> findPaginationByPartialName(@Param("name") String name, Pageable pageable);

	/**
	 * 유저의 Id List로 유저들을 찾습니다.
	 *
	 * @param userIds 유저 Id {@link List}
	 * @return {@link User} 리스트
	 */
	@Query("SELECT u FROM User u "
			+ "WHERE u.id IN :userIds AND u.deletedAt IS NULL")
	List<User> findAllByIds(List<Long> userIds);

	/**
	 *
	 */
	Page<User> findAllByRoleAndDeletedAtIsNull(@Param("role") UserRole role, Pageable pageable);

	/**
	 * 블랙홀에 빠질 위험이 있는 유저들의 정보를 조회합니다. blackholedAt이 현재 시간보다 과거인 유저들을 블랙홀에 빠질 위험이 있는 유저로 판단합니다.
	 *
	 * @return {@link User} 리스트
	 */
	@Query("SELECT u FROM User u WHERE u.blackholedAt IS NOT NULL OR u.blackholedAt <= CURRENT_TIMESTAMP")
	List<User> findByRiskOfFallingIntoBlackholeUsers();

	/**
	 * 블랙홀에 빠질 위험이 없는 유저들의 정보를 조회합니다. blackholedAt이 null이거나 현재 시간보다 미래인 유저들을 블랙홀에 빠질 위험이 없는 유저로
	 * 판단합니다.
	 *
	 * @return {@link User} 리스트
	 */
	@Query("SELECT u FROM User u WHERE u.blackholedAt IS NULL OR u.blackholedAt > CURRENT_TIMESTAMP")
	List<User> findByNoRiskOfFallingIntoBlackholeUsers();

	/**
	 * 유저의 id로 AlarmStatus 테이블과 결합된 유저 정보를 찾습니다.
	 */
	@Query("SELECT u FROM User u "
			+ "LEFT JOIN AlarmStatus o ON u.id = o.user.id "
			+ "WHERE u.id = :id")
	Optional<User> findUserByIdWithAlarmStatus(@Param("id") Long id);

	/**
	 * 현재 Active 상태의 Cabi User를 모두 가져옵니다.
	 *
	 * @return {@Link User} 리스트
	 */
	List<User> findAllByDeletedAtIsNull();

	/**
	 * 유저의 이름과 이메일이 일치하는 유저가 존재하는지 확인합니다.
	 *
	 * @param name  유저 이름
	 * @param email 유저 이메일
	 * @return 존재 여부
	 */
	@Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END " +
			"FROM User u " +
			"WHERE u.name = :name AND u.email = :email")
	boolean existsByNameAndEmail(String name, String email);
}
