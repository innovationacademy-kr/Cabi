package org.ftclub.cabinet.lent.controller;

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.dto.ReturnCabinetsRequestDto;
import org.ftclub.cabinet.lent.service.LentFacadeService;
import org.ftclub.cabinet.statistics.controller.StatisticsController;
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
	private static final Logger logger = LogManager.getLogger(AdminLentController.class);
	private final LentFacadeService lentFacadeService;

	@PatchMapping("/return-cabinets")
	@AuthGuard(level = ADMIN_ONLY)
	public void terminateLentCabinets(
			@Valid @RequestBody ReturnCabinetsRequestDto returnCabinetsRequestDto) {
		logger.info("Called terminateLentCabinets");
		lentFacadeService.terminateLentCabinets(returnCabinetsRequestDto);
	}

	@PatchMapping("/return-users/{userId}")
	@AuthGuard(level = ADMIN_ONLY)
	public void terminateLentUser(@PathVariable("userId") Long userId) {
		logger.info("Called terminateLentUser");
		lentFacadeService.terminateLentCabinet(userId);
	}

	@PostMapping("lent/users/{userId}/cabinets/{cabinetId}")
	@AuthGuard(level = ADMIN_ONLY)
	public void assignLent(@PathVariable("userId") Long userId,
			@PathVariable("cabinetId") Long cabinetId) {
		logger.info("Called assignLent");
		lentFacadeService.assignLent(userId, cabinetId);
	}
}
