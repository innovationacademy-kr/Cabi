package org.ftclub.cabinet.cabinet.repository;

import java.util.List;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.dto.ActiveCabinetInfoEntities;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.utils.annotations.ComplexRepository;

@ComplexRepository(entityClass = {Cabinet.class, CabinetPlace.class, LentHistory.class, User.class})
public interface CabinetComplexRepository {

	List<ActiveCabinetInfoEntities> findCabinetsActiveLentHistoriesByBuildingAndFloor(
			String building, Integer floor);

	List<Cabinet> findAllCabinetsByBuildingAndFloor(String building, Integer floor);
}
