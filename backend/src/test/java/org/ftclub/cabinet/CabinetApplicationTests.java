package org.ftclub.cabinet;

import org.ftclub.cabinet.cabinet.domain.CabinetRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
class CabinetApplicationTests {
	@Autowired
	CabinetRepository cabinetRepository;
	@Test
	void contextLoads() {
		Assertions.assertTrue(cabinetRepository.findAll().isEmpty());
	}

}
