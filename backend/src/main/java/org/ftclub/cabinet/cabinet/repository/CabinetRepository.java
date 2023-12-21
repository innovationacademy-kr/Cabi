package org.ftclub.cabinet.cabinet.repository;

import java.util.List;
import java.util.Optional;
import javax.persistence.LockModeType;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CabinetRepository extends JpaRepository<Cabinet, Long>, CabinetComplexRepository {

	/**
	 * 모든 빌딩을 조회한다.
	 *
	 * @return 빌딩 {@link List}
	 */
	@Query("SELECT DISTINCT p.location.building "
			+ "FROM CabinetPlace p ")
	List<String> findAllBuildings();

	/**
	 * 빌딩의 모든 층을 조회한다.
	 *
	 * @param building 빌딩
	 * @return 층 {@link List}
	 */
	@Query("SELECT DISTINCT p.location.floor "
			+ "FROM CabinetPlace p "
			+ "WHERE p.location.building = :building")
	List<Integer> findAllFloorsByBuilding(@Param("building") String building);

	/**
	 * cabinetId로 사물함을 조회한다.(조회 이후 업데이트를 위해 X Lock을 건다.)
	 *
	 * @param cabinetId 사물함 ID
	 * @return 사물함 {@link Optional}
	 */
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT c "
			+ "FROM Cabinet c "
			+ "WHERE c.cabinetId = :cabinetId")
	Optional<Cabinet> findByIdWithLock(@Param("cabinetId") Long cabinetId);

	/**
	 * cabinetId 리스트로 사물함을 조회한다.(조회 이후 업데이트를 위해 X Lock을 건다.)
	 *
	 * @param cabinetIds 사물함 ID 리스트
	 * @return 사물함 {@link List}
	 */
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT c "
			+ "FROM Cabinet c "
			+ "WHERE c.cabinetId IN (:cabinetIds)")
	List<Cabinet> findAllByIdsWithLock(List<Long> cabinetIds);

	/**
	 * userId로 현재 대여 중인 사물함을 조회한다.
	 *
	 * @param userId 사용자 ID
	 * @return 사물함 {@link Optional}
	 */
	@Query("SELECT c " +
			"FROM Cabinet c " +
			"LEFT JOIN LentHistory lh ON c.cabinetId = lh.cabinetId " +
			"LEFT JOIN User u ON u.userId = lh.userId " +
			"WHERE u.userId = :userId AND lh.endedAt IS NULL")
	Optional<Cabinet> findByUserIdAndLentHistoryEndedAtIsNull(@Param("userId") Long userId);

	/**
	 * userId로 현재 대여 중인 사물함을 조회한다.
	 *
	 * @param userId 사용자 ID
	 * @return 사물함 {@link Optional}
	 */
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT c " +
			"FROM Cabinet c " +
			"LEFT JOIN LentHistory lh ON c.cabinetId = lh.cabinetId " +
			"LEFT JOIN User u ON u.userId = lh.userId " +
			"WHERE u.userId = :userId AND lh.endedAt IS NULL")
	Optional<Cabinet> findByUserIdAndLentHistoryEndedAtIsNullWithLock(@Param("userId") Long userId);

	Page<Cabinet> findPaginationByLentType(@Param("lentType") LentType lentType, Pageable pageable);

	Page<Cabinet> findPaginationByStatus(@Param("status") CabinetStatus status, Pageable pageable);

	Page<Cabinet> findPaginationByVisibleNum(@Param("visibleNum") Integer visibleNum,
			Pageable pageable);

	@Query("SELECT c "
			+ "FROM Cabinet c "
			+ "JOIN FETCH c.cabinetPlace p "
			+ "WHERE p.location.building = :building AND p.location.floor = :floor")
	List<Cabinet> findAllByBuildingAndFloor(
			@Param("building") String building, @Param("floor") Integer floor);

	@Query("SELECT c "
			+ "FROM Cabinet c "
			+ "JOIN FETCH c.cabinetPlace p "
			+ "WHERE p.location.building = :building "
			+ "AND c.lentType <> :lentType "
			+ "AND c.status IN (:status)")
	List<Cabinet> findAllByBuildingAndLentTypeNotAndStatusIn(@Param("building") String building,
			@Param("lentType") LentType lentType, @Param("status") List<CabinetStatus> status);
}
