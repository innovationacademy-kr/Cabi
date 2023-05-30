package org.ftclub.cabinet.lent.repository;

import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.lent.domain.LentHistory;
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
}
