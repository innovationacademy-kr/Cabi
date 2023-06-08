package org.ftclub.cabinet.lent.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin")
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
		lentFacadeService.terminateLentCabinet(userId);
	}

	@PostMapping("lent/users/{userId}/cabinets/{cabinetId}")
	public void assignLent(@PathVariable("userId") Long userId,
			@PathVariable("cabinetId") Long cabinetId) {
		lentFacadeService.assignLent(userId, cabinetId);
	}
}
