package org.ftclub.cabinet.cabinet.repository;

import org.ftclub.cabinet.cabinet.domain.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

@Repository
public interface CabinetRepository extends JpaRepository<Cabinet, Long> {

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

    @Query("SELECT c.cabinetId "
            + "FROM Cabinet c "
            + "JOIN c.cabinetPlace p "
            + "WHERE p.location.section = :section "
            + "AND p.location.floor = :floor")
    List<Long> findAllCabinetIdsBySection(@Param("floor") Integer floor,
                                          @Param("section") String section);


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

    @Query("SELECT c " +
            "FROM Cabinet c " +
            "LEFT JOIN LentHistory lh ON c.cabinetId = lh.cabinetId " +
            "LEFT JOIN User u ON u.userId = lh.userId " +
            "WHERE u.userId = :userId AND lh.endedAt IS NULL")
    Optional<Cabinet> findLentCabinetByUserId(@Param("userId") Long userId);

    @Query("SELECT c.cabinetPlace "
            + "FROM Cabinet c "
            + "JOIN c.cabinetPlace p "
            + "WHERE p.location = :location")
    Optional<CabinetPlace> findCabinetPlaceByLocation(@Param("location") Location location);

    @Query("SELECT c "
            + "FROM Cabinet c "
            + "JOIN c.cabinetPlace p "
            + "WHERE p.location.building = :building AND p.location.floor = :floor AND p.location.section = :section")
    List<Cabinet> findAllByBuildingAndFloorAndSection(
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
    List<Cabinet> findAllCabinetsByLocation(Location location);
}
