package org.ftclub.cabinet.cabinet.repository;

import java.util.List;
import java.util.Optional;
import javax.persistence.LockModeType;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
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
	 * 여러 층에 걸쳐 CabinetStatus에 맞는 사물함의 개수를 조회한다.
	 *
	 * @param status 사물함 상태
	 * @param floor  층
	 * @return 사물함 개수 {@link List}
	 */
	@Query("SELECT count(c) "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE c.status = :status AND p.location.floor = :floor")
	int countByStatusAndFloor(@Param("status") CabinetStatus status, @Param("floor") Integer floor);

	/**
	 * 빌딩 리스트의 모든 층을 조회한다.
	 *
	 * @param buildings 빌딩 {@link List}
	 * @return 층 {@link List}
	 */
	@Query("SELECT DISTINCT p.location.floor "
			+ "FROM CabinetPlace p "
			+ "WHERE p.location.building IN (:buildings)")
	List<Integer> findAllFloorsByBuildings(@Param("buildings") List<String> buildings);

	/**
	 * cabinetId로 사물함을 조회한다.(조회 이후 업데이트를 위해 X Lock을 건다.)
	 *
	 * @param cabinetId 사물함 ID
	 * @return 사물함 {@link Optional}
	 */
	@Query("SELECT c "
			+ "FROM Cabinet c "
			+ "JOIN FETCH c.cabinetPlace p "
			+ "WHERE c.id = :cabinetId")
	Optional<Cabinet> findById(@Param("cabinetId") Long cabinetId);

	/**
	 * cabinetId로 사물함을 조회한다.(조회 이후 업데이트를 위해 X Lock을 건다.)
	 *
	 * @param cabinetId 사물함 ID
	 * @return 사물함 {@link Optional}
	 */
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT c "
			+ "FROM Cabinet c "
			+ "WHERE c.id = :cabinetId")
	Optional<Cabinet> findByIdWithXLock(@Param("cabinetId") Long cabinetId);

	/**
	 * cabinetId 리스트로 사물함을 조회한다.(조회 이후 업데이트를 위해 X Lock을 건다.)
	 *
	 * @param cabinetIds 사물함 ID 리스트
	 * @return 사물함 {@link List}
	 */
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT c "
			+ "FROM Cabinet c "
			+ "WHERE c.id IN (:cabinetIds)")
	List<Cabinet> findAllByIdsWithXLock(@Param("cabinetIds") List<Long> cabinetIds);

	/**
	 * userId로 현재 대여 중인 사물함을 조회한다.
	 *
	 * @param userId 사용자 ID
	 * @return 사물함 {@link Optional}
	 */
	@Query("SELECT c "
			+ "FROM Cabinet c "
			+ "LEFT JOIN LentHistory lh ON c.id = lh.cabinetId "
			+ "LEFT JOIN User u ON u.id = lh.userId "
			+ "WHERE u.id = :userId AND lh.endedAt IS NULL")
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
			"LEFT JOIN LentHistory lh ON c.id = lh.cabinetId " +
			"LEFT JOIN User u ON u.id = lh.userId " +
			"WHERE u.id = :userId AND lh.endedAt IS NULL")
	Optional<Cabinet> findByUserIdAndLentHistoryEndedAtIsNullWithXLock(
			@Param("userId") Long userId);

	/**
	 * status로 사물함을 조회한다.
	 *
	 * @param status   사물함 상태(CabinetStatus)
	 * @param pageable 페이지 정보
	 * @return
	 */
	@EntityGraph(attributePaths = {"cabinetPlace"})
	Page<Cabinet> findPaginationByStatus(@Param("status") CabinetStatus status, Pageable pageable);

	/**
	 * 사물함 번호에 해당하는 모든 사물함을 조회한다.
	 *
	 * @param visibleNum 사물함 번호
	 * @return 사물함 {@link List<Cabinet>}
	 */
	@EntityGraph(attributePaths = {"cabinetPlace"})
	List<Cabinet> findAllByVisibleNum(@Param("visibleNum") Integer visibleNum);

	/**
	 * 빌딩과 층에 해당하는 사물함을 모두 조회한다.
	 *
	 * @param building 빌딩명
	 * @param floor    층
	 * @return 사물함 {@link List<Cabinet>}
	 */
	@Query("SELECT c "
			+ "FROM Cabinet c "
			+ "JOIN FETCH c.cabinetPlace p "
			+ "WHERE p.location.building = :building AND p.location.floor = :floor")
	List<Cabinet> findAllByBuildingAndFloor(
			@Param("building") String building, @Param("floor") Integer floor);

	/**
	 * 빌딩에, 지정한 LentType 이 아니면서 CabinetStatus 에 해당하는 사물함을 모두 조회한다.
	 *
	 * @param building 빌딩명
	 * @param lentType 대여 타입
	 * @param status   사물함 상태 CabinetStatus
	 * @return
	 */
	@Query("SELECT c "
			+ "FROM Cabinet c "
			+ "JOIN FETCH c.cabinetPlace p "
			+ "WHERE p.location.building = :building "
			+ "AND c.lentType <> :lentType "
			+ "AND c.status IN (:status)")
	List<Cabinet> findAllByBuildingAndLentTypeNotAndStatusIn(@Param("building") String building,
			@Param("lentType") LentType lentType,
			@Param("status") List<CabinetStatus> status);

	/**
	 * 사물함 ID 리스트에 해당하는 사물함의 상태를 모두 변경한다.
	 *
	 * @param cabinetIds
	 * @param status
	 */
	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Query("UPDATE Cabinet c "
			+ "SET c.status = :status "
			+ "WHERE c.id IN (:cabinetIds)")
	void updateStatusByCabinetIdsIn(@Param("cabinetIds") List<Long> cabinetIds,
			@Param("status") CabinetStatus status);

	/**
	 * 사물함 ID 리스트에 해당하는 사물함의 상태, 제목, 메모를 모두 변경한다.
	 *
	 * @param cabinetIds
	 * @param status
	 * @param title
	 * @param memo
	 */
	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Query("UPDATE Cabinet c "
			+ "SET c.status = :status, c.title = :title, c.memo = :memo "
			+ "WHERE c.id IN (:cabinetIds)")
	void updateStatusAndTitleAndMemoByCabinetIdsIn(@Param("cabinetIds") List<Long> cabinetIds,
			@Param("status") CabinetStatus status,
			@Param("title") String title,
			@Param("memo") String memo);


	List<Cabinet> findAllByStatus(CabinetStatus cabinetStatus);

	@Query("SELECT p "
			+ "FROM CabinetPlace p "
			+ "WHERE p.location.building = :building AND p.location.floor = :floor AND p.location.section = :section ")
	Optional<CabinetPlace> findCabinetPlaceInfoByLocation(@Param("building") String building,
			@Param("floor") Integer floor, @Param("section") String section);
}
