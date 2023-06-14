package org.ftclub.cabinet.lent.controller;

import static org.ftclub.cabinet.auth.domain.AuthLevel.ADMIN_ONLY;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.domain.AuthGuard;
import org.ftclub.cabinet.dto.ReturnCabinetsRequestDto;
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

	@PatchMapping("/return-cabinets")
	@AuthGuard(level = ADMIN_ONLY)
	public void terminateLentCabinets(
			@Valid @RequestBody ReturnCabinetsRequestDto returnCabinetsRequestDto) {
		lentFacadeService.terminateLentCabinets(returnCabinetsRequestDto);
	}

	@PatchMapping("/return-users/{userId}")
	@AuthGuard(level = ADMIN_ONLY)
	public void terminateLentUser(@PathVariable("userId") Long userId) {
		lentFacadeService.terminateLentCabinet(userId);
	}

	@PostMapping("lent/users/{userId}/cabinets/{cabinetId}")
	@AuthGuard(level = ADMIN_ONLY)
	public void assignLent(@PathVariable("userId") Long userId,
			@PathVariable("cabinetId") Long cabinetId) {
		lentFacadeService.assignLent(userId, cabinetId);
	}
}
