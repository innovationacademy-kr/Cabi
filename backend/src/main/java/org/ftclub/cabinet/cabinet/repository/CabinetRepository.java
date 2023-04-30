package org.ftclub.cabinet.cabinet.repository;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CabinetRepository extends JpaRepository<Cabinet, Long> {

    @Query("SELECT DISTINCT c.cabinetPlace.location.floor "
            + "FROM Cabinet c "
            + "WHERE c.cabinetPlace.location.building =: building")
    List<Integer> findAllFloorsByBuilding(String building);

    @Query("SELECT DISTINCT c.cabinetPlace.location.building "
            + "FROM Cabinet c")
    List<String> findAllBuildings();
}
