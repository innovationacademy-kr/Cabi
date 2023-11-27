package org.ftclub.cabinet.cabinet.repository;

import java.util.List;
import java.util.Optional;
import javax.persistence.LockModeType;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CabinetRepository extends JpaRepository<Cabinet, Long>, CabinetComplexRepository {

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT c "
			+ "FROM Cabinet c "
			+ "WHERE c.cabinetId = :cabinetId")
	Optional<Cabinet> findByIdForUpdate(@Param("cabinetId") Long cabinetId);

	@Query("SELECT DISTINCT p.location.floor "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE p.location.building = :building")
	List<Integer> findAllFloorsByBuilding(@Param("building") String building);

	@Query("SELECT DISTINCT p.location.building "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p")
	List<String> findAllBuildings();

	@Query("SELECT DISTINCT p.location.section "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE p.location.building = :building AND p.location.floor = :floor")
	List<String> findAllSectionsByBuildingAndFloor(
			@Param("building") String building,
			@Param("floor") Integer floor);

	@Query("SELECT p.location "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE c.cabinetId = :cabinetId")
	Optional<Location> findLocationById(@Param("cabinetId") Long cabinetId);


	@Query(value = "SELECT AUTO_INCREMENT "
			+ "FROM information_schema.TABLES "
			+ "WHERE TABLE_SCHEMA = (SELECT DATABASE()) AND TABLE_NAME = 'cabinet'",
			nativeQuery = true)
	Optional<Long> getNextCabinetId();

	@Query("SELECT c " +
			"FROM Cabinet c " +
			"LEFT JOIN LentHistory lh ON c.cabinetId = lh.cabinetId " +
			"LEFT JOIN User u ON u.userId = lh.userId " +
			"WHERE u.userId = :userId AND lh.endedAt IS NULL")
	Optional<Cabinet> findLentCabinetByUserId(@Param("userId") Long userId);

	@Query("SELECT c " +
			"FROM Cabinet c " +
			"WHERE c.lentType = :lentType")
	Page<Cabinet> findPaginationByLentType(@Param("lentType") LentType lentType,
			Pageable pageable);

	@Query("SELECT c " +
			"FROM Cabinet c " +
			"WHERE c.status = :status")
	Page<Cabinet> findPaginationByStatus(@Param("status") CabinetStatus status,
			Pageable pageable);

	@Query("SELECT c " +
			"FROM Cabinet c " +
			"WHERE c.visibleNum = :visibleNum")
	Page<Cabinet> findPaginationByVisibleNum(@Param("visibleNum") Integer visibleNum,
			Pageable pageable);

	@Query("SELECT c " +
			"FROM Cabinet c " +
			"WHERE c.cabinetPlace.location = :location")
	List<Cabinet> findAllCabinetsByLocation(@Param("location") Location location);

	@EntityGraph(attributePaths = {"cabinetPlace"})
	@Query("SELECT DISTINCT c, lh, u " +
			"FROM Cabinet c " +
			"JOIN c.lentHistories lh ON lh.cabinetId = c.cabinetId " +
			"JOIN lh.user u ON lh.userId = u.userId " +
			"WHERE c.cabinetPlace.location.building = :building AND c.cabinetPlace.location.floor = :floor "
			+
			"AND lh.endedAt IS NULL")
	List<Object[]> findCabinetActiveLentHistoryUserListByBuildingAndFloor(
			@Param("building") String building, @Param("floor") Integer floor);

	@EntityGraph(attributePaths = {"cabinetPlace"})
	@Query("SELECT c " +
			"FROM Cabinet c " +
			"WHERE c.cabinetPlace.location.building = :building AND c.cabinetPlace.location.floor = :floor")
	List<Cabinet> findAllByBuildingAndFloor(
			@Param("building") String building, @Param("floor") Integer floor);

	@EntityGraph(attributePaths = {"cabinetPlace"})
	@Query("SELECT c " +
			"FROM Cabinet c " +
			"WHERE c.cabinetPlace.location.building = :building")
	List<Cabinet> findAllCabinetsByBuilding(@Param("building") String building);
}
