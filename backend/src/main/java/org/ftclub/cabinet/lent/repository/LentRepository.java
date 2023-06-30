package org.ftclub.cabinet.lent.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * {@link LentHistory}를 가져오기 위한 repository
 */
@Repository
public interface LentRepository extends JpaRepository<LentHistory, Long> {

	/**
	 * 사물함을 기준으로 아직 반납하지 않은 {@link LentHistory}중 하나를 가져옵니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @return 반납하지 않은 {@link LentHistory}의 {@link Optional}
	 */
	Optional<LentHistory> findFirstByCabinetIdAndEndedAtIsNull(@Param("cabinetId") Long cabinetId);

	/**
	 * 유저를 기준으로 아직 반납하지 않은 {@link LentHistory}중 하나를 가져옵니다.
	 *
	 * @param userId 찾으려는 user id
	 * @return 반납하지 않은 {@link LentHistory}의 {@link Optional}
	 */
	Optional<LentHistory> findFirstByUserIdAndEndedAtIsNull(@Param("userId") Long userId);

	/**
	 * 유저가 지금까지 빌렸던 {@link LentHistory}들을 가져옵니다. {@link Pageable}이 적용되었습니다.
	 *
	 * @param userId   찾으려는 user id
	 * @param pageable pagination 정보
	 * @return {@link LentHistory}들의 정보
	 */
	List<LentHistory> findByUserId(@Param("userId") Long userId, Pageable pageable);

	/**
	 * 유저가 지금까지 빌렸던 {@link LentHistory}들을 가져옵니다.(현재 빌리고 반납하지 않은 기록은 표시하지 않습니다.) {@link Pageable}이
	 * 적용되었습니다.
	 *
	 * @param userId   찾으려는 user id
	 * @param pageable pagination 정보
	 * @return
	 */
	List<LentHistory> findByUserIdAndEndedAtNotNull(@Param("userId") Long userId,
			Pageable pageable);

	/**
	 * 캐비넷의 {@link LentHistory}들을 가져옵니다. {@link Pageable}이 적용되었습니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @param pageable  pagination 정보
	 * @return {@link LentHistory}들의 정보
	 */
	List<LentHistory> findByCabinetId(@Param("cabinetId") Long cabinetId, Pageable pageable);

	/**
	 * 유저가 빌리고 있는 사물함의 개수를 가져옵니다.
	 *
	 * @param userId 찾으려는 user id
	 * @return 유저가 빌리고 있는 사물함 개수
	 */
	@Query("SELECT count(lh) " +
			"FROM LentHistory lh " +
			"WHERE lh.endedAt = null and lh.userId = :userId")
	int countUserActiveLent(@Param("userId") Long userId);

	/**
	 * 사물함을 빌리고 있는 유저의 수를 가져옵니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @return 사물함을 빌리고 있는 유저의 수
	 */
	@Query("SELECT count(lh) " +
			"FROM LentHistory lh " +
			"WHERE lh.endedAt = null and lh.cabinetId = :cabinetId")
	int countCabinetActiveLent(@Param("cabinetId") Long cabinetId);

	/**
	 * 유저가 지금까지 빌렸던 사물함의 개수를 가져옵니다.
	 *
	 * @param userId 찾으려는 user id
	 * @return 유저가 빌렸던 사물함의 개수
	 */
	@Query("SELECT count(lh) " +
			"FROM LentHistory lh " +
			"WHERE lh.userId = :userId")
	int countUserAllLent(@Param("userId") Long userId);

	/**
	 * 사물함을 빌렸던 유저의 수를 가져옵니다.
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @return 사물함을 빌렸던 유저의 수
	 */
	@Query("SELECT count(lh)" +
			"FROM LentHistory lh " +
			"WHERE lh.cabinetId = :cabinetId")
	int countCabinetAllLent(@Param("cabinetId") Long cabinetId);


	/**
	 * 사물함을 기준으로 아직 반납하지 않은 {@link LentHistory}를 모두 가져옵니다..
	 *
	 * @param cabinetId 찾으려는 cabinet id
	 * @return 반납하지 않은 {@link LentHistory}의 {@link List}
	 */
	@Query("SELECT lh " +
			"FROM LentHistory lh " +
			"WHERE lh.cabinetId = :cabinetId and lh.endedAt is null")
	List<LentHistory> findAllActiveLentByCabinetId(@Param("cabinetId") Long cabinetId);

	@Query("SELECT lh " +
			"FROM LentHistory lh " +
			"WHERE lh.cabinetId = :cabinetId")
	Page<LentHistory> findPaginationByCabinetId(@Param("cabinetId") Long cabinetId,
			Pageable pageable);

	/**
	 * 연체되어 있는 사물함을 모두 가져옵니다.
	 *
	 * @param date 연체의 기준 날짜/시간
	 * @return 연체되어 있는 {@link LentHistory}의 {@link List}
	 */
	@Query("SELECT lh " +
			"FROM LentHistory lh " +
			"WHERE lh.expiredAt < :date " +
			"AND YEAR(lh.expiredAt) <> 9999 " +
			"AND lh.endedAt is null " +
			"ORDER BY lh.expiredAt ASC")
	List<LentHistory> findAllOverdueLent(@Param("date") LocalDateTime date, Pageable pageable);

	@Query("SELECT count(lh) " +
			"FROM LentHistory lh " +
			"WHERE lh.startedAt > :endDate AND lh.startedAt < :startDate")
	Integer countLentByLentTimeBetween(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

	@Query("SELECT count(lh) " +
			"FROM LentHistory lh " +
			"WHERE :endDate < lh.endedAt AND lh.endedAt < :startDate")
	Integer countLentByReturnTimeBetween(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

	@Query("SELECT count(lh) " +
			"FROM LentHistory lh " +
			"WHERE lh.cabinetId = :cabinetId AND lh.endedAt IS NULL")
	Integer countCabinetAllActiveLent(Long cabinetId);
}
