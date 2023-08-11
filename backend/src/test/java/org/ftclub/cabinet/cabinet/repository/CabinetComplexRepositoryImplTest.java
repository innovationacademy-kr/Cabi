package org.ftclub.cabinet.cabinet.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import javax.transaction.Transactional;
import org.assertj.core.api.Assertions;
import org.ftclub.cabinet.cabinet.service.CabinetService;
import org.ftclub.cabinet.dto.ActiveCabinetInfoEntities;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Transactional
class CabinetComplexRepositoryImplTest {
	@Autowired
	CabinetRepository cabinetRepository;
	@Autowired
	CabinetOptionalFetcher cabinetOptionalFetcher;

	@Test
	void test() {
		List<ActiveCabinetInfoEntities> old = cabinetOptionalFetcher.findCabinetsActiveLentHistoriesByBuildingAndFloor(
				"새롬관", 2);


		System.out.println();
		List<ActiveCabinetInfoEntities> newThing = cabinetRepository.findCabinetsActiveLentHistoriesByBuildingAndFloor(
				"새롬관", 2);


		System.out.println(old.size());
		System.out.println(newThing.size());
		Assertions.assertThat(old).isEqualTo(newThing);
	}

}