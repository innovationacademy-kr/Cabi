package org.ftclub.cabinet.cabinet.repository;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CabinetPlaceRepository extends JpaRepository<CabinetPlace, Long> {

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
	 * 빌딩 리스트의 모든 층을 조회한다.
	 *
	 * @param buildings 빌딩 {@link List}
	 * @return 층 {@link List}
	 */
	@Query("SELECT DISTINCT p.location.floor "
			+ "FROM CabinetPlace p "
			+ "WHERE p.location.building IN (:buildings)")
	List<Integer> findAllFloorsByBuildings(@Param("buildings") List<String> buildings);
}
