package org.ftclub.cabinet.cabinet.repository;

import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.cabinet.domain.LentType;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CabinetRepository extends JpaRepository<Cabinet, Long> {

	@Query("SELECT DISTINCT p.location.floor "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE p.location.building = :building")
	Optional<List<Integer>> findAllFloorsByBuilding(@Param("building") String building);

	@Query("SELECT DISTINCT p.location.building "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p")
	Optional<List<String>> findAllBuildings();

	@Query("SELECT p.location.section "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE p.location.building = :building AND p.location.floor = :floor")
	Optional<List<String>> findAllSectionsByBuildingAndFloor(
			@Param("building") String building,
			@Param("floor") Integer floor);

	@Query("SELECT c.cabinetId "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE p.location.section = :section")
	Optional<List<Long>> findAllCabinetIdsBySection(@Param("section") String section);


	@Query("SELECT c.statusNote "
			+ "FROM Cabinet c ")
	Optional<String> findStatusNoteById(@Param("cabinetId") Long cabinetId);

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

	@Query("SELECT c.cabinetPlace "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE p.location = :location")
	Optional<CabinetPlace> findCabinetPlaceByLocation(@Param("location") Location location);

	@Query("SELECT c "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE p.location.building = :building AND p.location.floor = :floor AND p.location.section = :section")
	Optional<List<Cabinet>> findAllByBuildingAndFloorAndSection(
			@Param("building") String building,
			@Param("floor") Integer floor,
			@Param("section") String section);

	@Query("SELECT COUNT(p.location.building) > 0 " +
			"FROM Cabinet c " +
			"JOIN c.cabinetPlace p " +
			"WHERE p.location.building = :building AND p.location.floor = :floor")
	boolean existsBuildingAndFloor(
			@Param("building") String building,
			@Param("floor") Integer floor);

	@Query("SELECT c " +
			"FROM Cabinet c " +
			"WHERE c.lentType = :lentType")
	List<Cabinet> findAllCabinetsByLentType(@Param("lentType") LentType lentType,
			Pageable pageable);

	@Query("SELECT c " +
			"FROM Cabinet c " +
			"WHERE c.status = :status")
	List<Cabinet> findAllCabinetsByStatus(@Param("status") CabinetStatus status,
			Pageable pageable);

	@Query("SELECT c " +
			"FROM Cabinet c " +
			"WHERE c.visibleNum = :visibleNum")
	List<Cabinet> findAllCabinetsByVisibleNum(@Param("visibleNum") Integer visibleNum,
			Pageable pageable);

	@Query("SELECT COUNT(c) " +
			"FROM Cabinet c " +
			"WHERE c.lentType = :lentType")
	Integer countByLentType(LentType lentType);

	@Query("SELECT COUNT(c) " +
			"FROM Cabinet c " +
			"WHERE c.status = :status")
	Integer countByStatus(CabinetStatus status);

	@Query("SELECT COUNT(c) " +
			"FROM Cabinet c " +
			"WHERE c.visibleNum = :visibleNum")
	Integer countByVisibleNum(Integer visibleNum);
}
