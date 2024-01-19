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

	/**
	 * 특정 기간 사이에 사물함을 빌렸던 유저의 수를 가져옵니다.
	 *
	 * @param startDate 시작 날짜
	 * @param endDate   끝 날짜
	 * @return 특정 기간 사이에 사물함을 빌렸던 유저의 수
	 */
	@Query("SELECT count(lh) "
			+ "FROM LentHistory lh "
			+ "WHERE lh.startedAt < :endDate AND lh.startedAt >= :startDate")
	int countLentFromStartDateToEndDate(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

	/**
	 * 특정 기간 사이에 사물함을 반납한 유저의 수를 가져옵니다.
	 *
	 * @param startDate 시작 날짜
	 * @param endDate   끝 날짜
	 * @return 특정 기간 사이에 사물함을 반납한 유저의 수
	 */
	@Query("SELECT count(lh) "
			+ "FROM LentHistory lh "
			+ "WHERE lh.endedAt < :endDate AND lh.endedAt >= :startDate")
	int countReturnFromStartDateToEndDate(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

	/**
	 * 특정 사물함의 아직 반납하지 않은 대여기록을 가져옵니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @return 반납하지 않은 {@link LentHistory}의 {@link Optional}
	 */
	Optional<LentHistory> findByCabinetIdAndEndedAtIsNull(@Param("cabinetId") Long cabinetId);

	/***
	 * 특정 사물함의 반납된 대여 기록들을 가져옵니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @return 반납한 {@link LentHistory}의 {@link List}
	 */
	List<LentHistory> findByCabinetIdAndEndedAtIsNotNull(@Param("cabinetId") Long cabinetId);

	/**
	 * 특정 유저의 아직 반납하지 않은 대여 기록을 가져옵니다.
	 *
	 * @param userId 찾으려는 user id
	 * @return 반납하지 않은 {@link LentHistory}의 {@link Optional}
	 */
	Optional<LentHistory> findByUserIdAndEndedAtIsNull(@Param("userId") Long userId);

	/**
	 * 특정 유저의 아직 반납하지 않은 대여 기록을 가져옵니다.
	 * <p>
	 * X Lock을 걸어서 가져옵니다.
	 * </p>
	 * <p>
	 * user 정보를 Join하여 가져옵니다.
	 * </p>
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

	/**
	 * 유저가 빌리고 있는 사물함의 아직 반납하지 않은 대여 기록들을 가져옵니다.
	 * <p>
	 * X Lock을 걸어서 가져옵니다.
	 * </p>
	 * <p>
	 * subQuery를 사용하여 가져옵니다.
	 * </p>
	 *
	 * @param userId 찾으려는 user id
	 * @return 유저가 빌리고 있는 사물함의 아직 반납하지 않은 {@link LentHistory}의 {@link List}
	 */
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT lh "
			+ "FROM LentHistory lh "
			+ "LEFT JOIN FETCH lh.user u "
			+ "WHERE lh.endedAt IS NULL "
			+ "AND lh.cabinetId = ("
			+ "     SELECT lh2.cabinetId FROM LentHistory lh2 "
			+ "     WHERE lh2.userId = :userId AND lh2.endedAt IS NULL)")
	List<LentHistory> findAllByCabinetIdWithSubQueryWithXLock(@Param("userId") Long userId);

	/**
	 * 특정 사물함의 대여기록들을 모두 가져옵니다.
	 * <p>
	 * {@link Pageable}이 적용되었습니다.
	 * </p>
	 * <p>
	 * cabinet 정보와 user 정보를 Join하여 가져옵니다.
	 * </p>
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @param pageable  pagination 정보
	 * @return {@link LentHistory}의 {@link Page}
	 */
	@Query(value = "SELECT lh "
			+ "FROM LentHistory lh "
			+ "LEFT JOIN FETCH lh.user u "
			+ "LEFT JOIN FETCH lh.cabinet c "
			+ "WHERE lh.cabinetId = :cabinetId ",
			countQuery = "SELECT count(lh) "
					+ "FROM LentHistory lh "
					+ "WHERE lh.cabinetId = :cabinetId ")
	Page<LentHistory> findPaginationByCabinetIdJoinCabinetAndUser(
			@Param("cabinetId") Long cabinetId, Pageable pageable);

	/**
	 * 특정 유저가 지금까지 빌렸던 대여기록들을 모두 가져옵니다.
	 * <p>
	 * {@link Pageable}이 적용되었습니다.
	 * </p>
	 *
	 * @param userId   찾으려는 user id
	 * @param pageable pagination 정보
	 * @return {@link LentHistory}의 {@link Page}
	 */
	Page<LentHistory> findPaginationByUserId(@Param("userId") Long userId, Pageable pageable);

	/**
	 * 특정 사물함의 아직 반납하지 않은 대여기록들를 모두 가져옵니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @return 반납하지 않은 {@link LentHistory}의 {@link List}
	 */
	List<LentHistory> findAllByCabinetIdAndEndedAtIsNull(@Param("cabinetId") Long cabinetId);

	/**
	 * 여러 사물함의 아직 반납하지 않은 대여기록들을 모두 가져옵니다.
	 * <p>
	 * 유저 정보를 Join하여 가져옵니다.
	 * </p>
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
	 * 현재 대여 중인 대여 기록들을 모두 가져옵니다.
	 * <p>
	 * cabinet 정보와 user 정보를 Join하여 가져옵니다.
	 * </p>
	 *
	 * @return 연체되어 있는 {@link LentHistory}의 {@link List}
	 */
	@Query("SELECT lh "
			+ "FROM LentHistory lh "
			+ "LEFT JOIN FETCH lh.user u "
			+ "LEFT JOIN FETCH lh.cabinet c "
			+ "LEFT JOIN FETCH c.cabinetPlace cp "
			+ "WHERE lh.endedAt IS NULL")
	List<LentHistory> findAllByEndedAtIsNullJoinCabinetAndUser();

	/**
	 * 기준 날짜보다 반납 기한이 나중인 모든 사물함들의 대여 기록을 가져옵니다.
	 *
	 * @param cabinetIds 조회하고자 하는 사물함의 Id {@link List}
	 * @param date       조회하고자 하는 날짜(시간 제외)
	 * @return 조회하고자 하는 사물함들 {@link LentHistory}의 {@link List}
	 */
	@Query("SELECT lh "
			+ "FROM LentHistory lh "
			+ "WHERE lh.cabinetId IN :cabinetIds "
			+ "AND DATE(lh.endedAt) = DATE(:date)")
	List<LentHistory> findAllByCabinetIdsEndedAtEqualDate(@Param("date") LocalDate date,
			@Param("cabinetIds") List<Long> cabinetIds);

	/**
	 * 특정 유저의 아직 반납하지 않은 대여 기록을 가져옵니다.
	 * <p>
	 * cabinet 정보를 Join하여 가져옵니다.
	 * </p>
	 *
	 * @param userId
	 * @return
	 */
	@Query("SELECT lh "
			+ "FROM LentHistory lh "
			+ "LEFT JOIN FETCH lh.cabinet c "
			+ "LEFT JOIN FETCH c.cabinetPlace cp "
			+ "WHERE lh.userId = :userId AND lh.endedAt IS NULL")
	Optional<LentHistory> findByUserIdAndEndedAtIsNullJoinCabinet(@Param("userId") Long userId);

	/**
	 * 특정 유저들의 아직 반납하지 않은 대여 기록을 가져옵니다.
	 * <p>
	 * cabinet 정보를 Join하여 가져옵니다.
	 * </p>
	 *
	 * @param userIds 찾으려는 user id {@link List}
	 * @return 반납하지 않은 {@link LentHistory}의 {@link List}
	 */
	@Query("SELECT lh "
			+ "FROM LentHistory lh "
			+ "LEFT JOIN FETCH lh.cabinet c "
			+ "LEFT JOIN FETCH c.cabinetPlace cp "
			+ "WHERE lh.userId IN (:userIds) AND lh.endedAt IS NULL")
	List<LentHistory> findByUserIdsAndEndedAtIsNullJoinCabinet(
			@Param("userIds") List<Long> userIds);

	/**
	 * 특정 사물함들의 대여 기록을 가져옵니다.
	 *
	 * @param cabinetIds 찾으려는 cabinet id {@link List}
	 * @return {@link LentHistory}의 {@link List}
	 */
	List<LentHistory> findAllByCabinetIdIn(List<Long> cabinetIds);

	/**
	 * 연체되어 있는 사물함을 모두 가져옵니다.
	 * <p>
	 * {@link Pageable}이 적용되었습니다.
	 * </p>
	 * <p>
	 * cabinet 정보와 user 정보를 Join하여 가져옵니다.
	 * </p>
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

	/**
	 * 여러 유저들의 반납 날짜를 수정합니다.
	 * <p>
	 * {@link Modifying}과 {@link Query}를 사용하여 여러 대여 기록을 한번에 업데이트합니다.
	 * </p>
	 *
	 * @param userIds 찾으려는 user id {@link List}
	 * @param endedAt 반납 날짜
	 */
	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Query("UPDATE LentHistory lh "
			+ "SET lh.endedAt = :endedAt "
			+ "WHERE lh.userId IN (:userIds) "
			+ "AND lh.endedAt IS NULL")
	void updateEndedAtByUserIdIn(@Param("userIds") List<Long> userIds,
			@Param("endedAt") LocalDateTime endedAt);

	/**
	 * 여러 대여 기록의 만료 시간을 수정합니다.
	 *
	 * @param lentHistoryIds 대여 기록 id {@link List}
	 * @param expiredAt      만료 시간
	 */
	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Query("UPDATE LentHistory lh "
			+ "SET lh.expiredAt = :expiredAt "
			+ "WHERE lh.id IN (:lentHistoryIds)")
	void updateExpiredAtByIdIn(@Param("lentHistoryIds") List<Long> lentHistoryIds,
			@Param("expiredAt") LocalDateTime expiredAt);
}