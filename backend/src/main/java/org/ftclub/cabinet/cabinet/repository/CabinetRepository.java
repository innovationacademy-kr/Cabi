package org.ftclub.cabinet.cabinet.repository;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CabinetRepository extends JpaRepository<Cabinet, Long> {

    @Query("SELECT p.location.floor "
            + "FROM Cabinet c "
            + "JOIN c.cabinetPlace p "
            + "WHERE p.location.building = :building")
    public List<Integer> findAllFloorsByBuilding(String building);

    @Query("SELECT p.location.building "
            + "FROM Cabinet c "
            + "JOIN c.cabinetPlace p")
    public List<String> findAllBuildings();

    @Query("SELECT p.location.section "
            + "FROM Cabinet c "
            + "JOIN c.cabinetPlace p "
            + "WHERE p.location.building = :building AND p.location.floor = :floor")
    public List<String> findAllSectionsByBuildingAndFloor(String building, Integer floor);

    @Query("SELECT c.cabinetId "
            + "FROM Cabinet c "
            + "JOIN c.cabinetPlace p "
            + "WHERE p.location.section = :section")
    List<Long> findAllCabinetIdsBySection(String section);
}
