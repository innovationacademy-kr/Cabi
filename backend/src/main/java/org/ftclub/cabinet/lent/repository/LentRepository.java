package org.ftclub.cabinet.lent.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import javax.persistence.LockModeType;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * {@link LentHistory}를 가져오기 위한 repository
 */
@Repository
public interface LentRepository extends JpaRepository<LentHistory, Long> {

	/**
	 * 유저가 지금까지 빌렸던 사물함의 개수를 가져옵니다.
	 *
	 * @param userId 찾으려는 user id
	 * @return 유저가 빌렸던 사물함의 개수
	 */
	@Query("SELECT count(lh) "
			+ "FROM LentHistory lh "
			+ "WHERE lh.userId = :userId")
	int countByUserId(@Param("userId") Long userId);

	/**
	 * 유저가 빌리고 있는 사물함의 개수를 가져옵니다.
	 *
	 * @param userId 찾으려는 user id
	 * @return 유저가 빌리고 있는 사물함 개수
	 */
	@Query("SELECT count(lh) "
			+ "FROM LentHistory lh "
			+ "WHERE lh.endedAt = null and lh.userId = :userId")
	int countByUserIdAndEndedAtIsNull(@Param("userId") Long userId);

	/**
	 * 사물함을 빌렸던 유저의 수를 가져옵니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @return 사물함을 빌렸던 유저의 수
	 */
	@Query("SELECT count(lh)"
			+ "FROM LentHistory lh "
			+ "WHERE lh.cabinetId = :cabinetId")
	int countByCabinetId(@Param("cabinetId") Long cabinetId);

	/**
	 * 사물함을 빌리고 있는 유저의 수를 가져옵니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @return 사물함을 빌리고 있는 유저의 수
	 */
	@Query("SELECT count(lh) "
			+ "FROM LentHistory lh "
			+ "WHERE lh.endedAt = null and lh.cabinetId = :cabinetId")
	int countByCabinetIdAndEndedAtIsNull(@Param("cabinetId") Long cabinetId);

	@Query("SELECT count(lh) "
			+ "FROM LentHistory lh "
			+ "WHERE lh.startedAt < :endDate AND lh.startedAt >= :startDate")
	int countLentFromStartDateToEndDate(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

	@Query("SELECT count(lh) "
			+ "FROM LentHistory lh "
			+ "WHERE lh.endedAt < :endDate AND lh.endedAt >= :startDate")
	int countReturnFromStartDateToEndDate(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

	/**
	 * 사물함을 기준으로 아직 반납하지 않은 {@link LentHistory}중 하나를 가져옵니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @return 반납하지 않은 {@link LentHistory}의 {@link Optional}
	 */
	Optional<LentHistory> findByCabinetIdAndEndedAtIsNull(@Param("cabinetId") Long cabinetId);

	/***
	 * 사물함을 기준으로 가장 최근에 반납한 {@link LentHistory} 를 가져옵니다.
	 * @param cabinetId 찾으려는 cabinet id
	 * @return 반납한 {@link LentHistory}의 {@link Optional}
	 */
	List<LentHistory> findByCabinetIdAndEndedAtIsNotNull(@Param("cabinetId") Long cabinetId);

	/**
	 * 유저를 기준으로 아직 반납하지 않은 {@link LentHistory}중 하나를 가져옵니다.
	 *
	 * @param userId 찾으려는 user id
	 * @return 반납하지 않은 {@link LentHistory}의 {@link Optional}
	 */
	Optional<LentHistory> findByUserIdAndEndedAtIsNull(@Param("userId") Long userId);

	/**
	 * 유저를 기준으로 아직 반납하지 않은 {@link LentHistory}중 하나를 가져옵니다. X Lock을 걸어서 가져옵니다.
	 *
	 * @param userId 찾으려는 user id
	 * @return 반납하지 않은 {@link LentHistory}의 {@link Optional}
	 */
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT lh "
			+ "FROM LentHistory lh "
			+ "LEFT JOIN FETCH lh.user u "
			+ "WHERE lh.userId = :userId AND lh.endedAt is null")
	Optional<LentHistory> findByUserIdAndEndedAtIsNullForUpdate(@Param("userId") Long userId);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT lh "
			+ "FROM LentHistory lh "
			+ "LEFT JOIN FETCH lh.user u "
			+ "WHERE lh.endedAt IS NULL "
			+ "AND lh.cabinetId = ("
			+ "     SELECT lh2.cabinetId FROM LentHistory lh2 "
			+ "     WHERE lh2.userId = :userId AND lh2.endedAt IS NULL)")
	List<LentHistory> findAllByCabinetIdWithSubQuery(@Param("userId") Long userId);

	/**
	 * 사물함의 대여기록 {@link LentHistory}들을 모두 가져옵니다. {@link Pageable}이 적용되었습니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @param pageable  pagination 정보
	 * @return {@link LentHistory}의 {@link Page}
	 */
	Page<LentHistory> findPaginationByCabinetId(
			@Param("cabinetId") Long cabinetId, Pageable pageable);

	/**
	 * 유저가 지금까지 빌렸던 {@link LentHistory}들을 모두 가져옵니다. {@link Pageable}이 적용되었습니다.
	 *
	 * @param userId   찾으려는 user id
	 * @param pageable pagination 정보
	 * @return {@link LentHistory}의 {@link Page}
	 */
	Page<LentHistory> findPaginationByUserId(@Param("userId") Long userId, Pageable pageable);

	/**
	 * 유저가 지금까지 빌렸던 {@link LentHistory}들을 가져옵니다.(현재 빌리고 반납하지 않은 기록은 표시하지 않습니다.) {@link Pageable}이
	 * 적용되었습니다.
	 *
	 * @param userId   찾으려는 user id
	 * @param pageable pagination 정보
	 * @return 반납했던 {@link LentHistory}의 {@link Page}
	 */
	Page<LentHistory> findPaginationByUserIdAndEndedAtNotNull(
			@Param("userId") Long userId, Pageable pageable);

	/**
	 * 사물함을 기준으로 아직 반납하지 않은 {@link LentHistory}를 모두 가져옵니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @return 반납하지 않은 {@link LentHistory}의 {@link List}
	 */
	List<LentHistory> findAllByCabinetIdAndEndedAtIsNull(@Param("cabinetId") Long cabinetId);

	/**
	 * 여러 사물함을 기준으로 아직 반납하지 않은 {@link LentHistory}를 모두 가져옵니다.
	 *
	 * @param cabinetIds 찾으려는 cabinet id {@link List}
	 * @return 반납하지 않은 {@link LentHistory}의 {@link List}
	 */
	@Query("SELECT lh "
			+ "FROM LentHistory lh "
			+ "LEFT JOIN FETCH lh.user u "
			+ "WHERE lh.cabinetId IN (:cabinetIds) "
			+ "AND lh.endedAt IS NULL ")
	List<LentHistory> findAllByCabinetIdInAndEndedAtIsNullJoinUser(
			@Param("cabinetIds") List<Long> cabinetIds);

	/**
	 * 대여 중인 사물함을 모두 가져옵니다.
	 *
	 * @return 연체되어 있는 {@link LentHistory}의 {@link List}
	 */
	List<LentHistory> findAllByEndedAtIsNull();

	/**
	 * 여러 사물함들의 대여 기록을 모두 가져옵니다.
	 *
	 * @param cabinetIds 조회하고자 하는 사물함의 Id {@link List}
	 * @param date       조회하고자 하는 날짜(시간 제외)
	 * @return 조회하고자 하는 사물함들 {@link LentHistory}의 {@link List}
	 */
	@Query("SELECT lh "
			+ "FROM LentHistory lh "
			+ "WHERE lh.cabinetId IN :cabinetIds "
			+ "AND DATE(lh.endedAt) >= DATE(:date)")
	List<LentHistory> findAllByCabinetIdsAfterDate(@Param("date") LocalDate date,
			@Param("cabinetIds") List<Long> cabinetIds);

	@Query("SELECT lh "
			+ "FROM LentHistory lh "
			+ "LEFT JOIN FETCH lh.cabinet c "
			+ "LEFT JOIN FETCH c.cabinetPlace cp "
			+ "WHERE lh.userId IN (:userIds) AND lh.endedAt IS NULL")
	List<LentHistory> findByUserIdsAndEndedAtIsNullJoinCabinet(
			@Param("userIds") List<Long> userIds);

	/**
	 * 연체되어 있는 사물함을 모두 가져옵니다.
	 *
	 * @param date 연체의 기준 날짜/시간
	 * @return 연체되어 있는 {@link LentHistory}의 {@link List}
	 */
	@Query(value = "SELECT lh "
			+ "FROM LentHistory lh "
			+ "LEFT JOIN FETCH lh.user u "
			+ "LEFT JOIN FETCH lh.cabinet c "
			+ "LEFT JOIN FETCH c.cabinetPlace cp "
			+ "WHERE lh.expiredAt < :date AND lh.endedAt IS NULL",
			countQuery = "SELECT count(lh) FROM LentHistory lh "
					+ "WHERE lh.expiredAt < :date AND lh.endedAt IS NULL")
	Page<LentHistory> findAllExpiredAtBeforeAndEndedAtIsNullJoinUserAndCabinet(
			@Param("date") LocalDateTime date, Pageable pageable);

	@Query("SELECT lh "
			+ "FROM LentHistory lh "
			+ "WHERE lh.endedAt IS NULL "
			+ "AND lh.cabinetId "
			+ "IN (SELECT lh2.cabinetId "
			+ "FROM LentHistory lh2 WHERE lh2.userId = :userId AND lh2.endedAt IS NULL)")
	List<LentHistory> findAllActiveLentHistoriesByUserId(@Param("userId") Long userId);

	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Query("UPDATE LentHistory lh "
			+ "SET lh.endedAt = :endedAt "
			+ "WHERE lh.userId IN (:userIds) "
			+ "AND lh.endedAt IS NULL")
	void updateEndedAtByUserIdIn(@Param("userIds") List<Long> userIds,
			@Param("endedAt") LocalDateTime endedAt);
}