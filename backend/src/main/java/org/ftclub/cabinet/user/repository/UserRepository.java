package org.ftclub.cabinet.user.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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
	 * 소프트 딜리트 사용으로 인한 Deprecated
	 */
	@Override
	@Deprecated
	public void deleteById(Long userId);

	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Query("UPDATE User u " +
			"SET u.deletedAt = :deletedAt " +
			"WHERE u.id = :userId")
	void deleteById(@Param("userId") Long userId, @Param("deletedAt") LocalDateTime deletedAt);

	/**
	 * 유저 이름으로 유저를 찾습니다.
	 *
	 * @param name 유저 이름
	 * @return {@link User}
	 */
	@Query("SELECT u FROM User u WHERE u.name = :name AND u.deletedAt IS NULL")
	Optional<User> findByName(@Param("name") String name);

	/**
	 * 유저의 이메일로 유저를 찾습니다.
	 *
	 * @param email 유저 이메일
	 * @return {@link User}
	 */
	@Query("SELECT u FROM User u WHERE u.email = :email AND u.deletedAt IS NULL")
	Optional<User> findByEmail(@Param("email") String email);

	/**
	 * 유저의 이름 일부분으로 유저를 찾습니다.
	 *
	 * @param name     유저 이름 일부분
	 * @param pageable 페이징 정보
	 * @return {@link User} 리스트
	 */
	@Query("SELECT u FROM User u WHERE u.name LIKE %:name% AND u.deletedAt IS NULL")
	Page<User> findPaginationByPartialName(@Param("name") String name, Pageable pageable);

	/**
	 * 유저의 Id List로 유저들을 찾습니다.
	 *
	 * @param userIds 유저 Id {@link List}
	 * @return {@link User} 리스트
	 */
	@Query("SELECT u FROM User u "
			+ "WHERE u.id IN :userIds AND u.deletedAt IS NULL AND u.deletedAt IS NULL")
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
	@Query("SELECT u FROM User u WHERE u.blackholedAt <= :blackholedAt AND u.deletedAt IS NULL")
	List<User> findByBlackholedAtLessThanOrEqual(@Param("blackholedAt") LocalDateTime blackholedAt);

    /**
     * 블랙홀에 빠질 위험이 없는 유저들의 정보를 조회합니다. blackholedAt이 null이거나 현재 시간보다 미래인 유저들을 블랙홀에 빠질 위험이 없는 유저로
     * 판단합니다. + "WHERE lh.endedAt < :endDate AND lh.endedAt >= :startDate") int
     * countReturnFromStartDateToEndDate(@Param("startDate") LocalDateTime startDate,
     *
     * @return {@link User} 리스트
     * @Param("endDate") LocalDateTime endDate);
     */
    @Query("SELECT u FROM User u WHERE u.blackholedAt > :blackholedAt AND u.deletedAt IS NULL")
    List<User> findByBlackholedAtAfter(@Param("blackholedAt") LocalDateTime blackholedAt);

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
            "WHERE u.name = :name AND u.email = :email AND u.deletedAt IS NULL")
    boolean existsByNameAndEmail(String name, String email);

    @Query("SELECT u FROM User u WHERE u.name IN :userNames AND u.deletedAt IS NULL")
    List<User> findAllUsersInNames(List<String> userNames);
}
