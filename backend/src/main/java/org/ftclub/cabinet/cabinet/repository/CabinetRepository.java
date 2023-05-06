package org.ftclub.cabinet.cabinet.repository;

import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.cabinet.domain.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CabinetRepository extends JpaRepository<Cabinet, Long> {

	@Query("SELECT DISTINCT p.location.floor "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE p.location.building = :building")
	Optional<List<Integer>> findAllFloorsByBuilding(String building);

	@Query("SELECT DISTINCT p.location.building "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p")
	Optional<List<String>> findAllBuildings();

	@Query("SELECT p.location.section "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE p.location.building = :building AND p.location.floor = :floor")
	Optional<List<String>> findAllSectionsByBuildingAndFloor(String building, Integer floor);

	@Query("SELECT c.cabinetId "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE p.location.section = :section")
	Optional<List<Long>> findAllCabinetIdsBySection(String section);


	@Query("SELECT c.statusNote "
			+ "FROM Cabinet c ")
	Optional<String> findStatusNoteById(Long cabinetId);

	@Query("SELECT p.location "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE c.cabinetId = :cabinetId")
	Optional<Location> findLocationById(Long cabinetId);


	@Query(value = "SELECT AUTO_INCREMENT "
			+ "FROM information_schema.TABLES "
			+ "WHERE TABLE_SCHEMA = (SELECT DATABASE()) AND TABLE_NAME = 'cabinet'",
			nativeQuery = true)
	Optional<Long> getNextCabinetId();

	@Query("SELECT c.cabinetPlace "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE p.location = :location")
	Optional<CabinetPlace> findCabinetPlaceByLocation(Location location);

	@Query("SELECT c "
			+ "FROM Cabinet c "
			+ "JOIN c.cabinetPlace p "
			+ "WHERE p.location.building = :building AND p.location.floor = :floor AND p.location.section = :section")
	Optional<List<Cabinet>> findAllByBuildingAndFloorAndSection(String building, Integer floor,
			String section);
}
