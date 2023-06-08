package org.ftclub.cabinet.lent.controller;

import java.util.List;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminLentController {

	private final LentFacadeService lentFacadeService;

	/**
	 * To-Do /api/admin/search/statistics /api/admin/return/bundle/cabinet
	 * /api/admin/return/user/:userId /api/admin/return/cabinet/:cabinetId
	 * /api/admin/lent/cabinet/:cabinetId/:userId
	 */
	@PatchMapping("/return-cabinets")
	public void terminateLentCabinets(@RequestBody List<Long> cabinets) {
		lentFacadeService.terminateLentCabinets(cabinets);
	}

	@PatchMapping("/return-users/{userId}")
	public void terminateLentUser(Long userId) {
		lentFacadeService.terminateLentByUserId(userId);
	}
}
