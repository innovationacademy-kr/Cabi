package org.ftclub.cabinet;

import org.ftclub.cabinet.cabinet.service.CabinetFacadeServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SectionTest {

	@Autowired
	private CabinetFacadeServiceImpl cabinetFacadeService;

	@Test
	void test() {
		System.out.println("cabinetFacadeService.getCabinetsPerSection2() = " + cabinetFacadeService.getCabinetsPerSection2("새롬관", 2));
	}
}
