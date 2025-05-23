package org.ftclub.cabinet.admin.lent.controller;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.admin.lent.service.AdminLentFacadeService;
import org.ftclub.cabinet.dto.ReturnCabinetsRequestDto;
import org.ftclub.cabinet.dto.ReturnUserRequestDto;
import org.ftclub.cabinet.log.Logging;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v4/admin")
@Logging
public class AdminLentController {

	private final AdminLentFacadeService adminLentFacadeService;

	@PatchMapping("/return-cabinets")
	public void terminateLentCabinets(
			@Valid @RequestBody ReturnCabinetsRequestDto returnCabinetsRequestDto) {
		adminLentFacadeService.endCabinetLent(returnCabinetsRequestDto.getCabinetIds());
	}

	@PatchMapping("/return-users")
	public void terminateLentUser(
			@Valid @RequestBody ReturnUserRequestDto returnUserRequestDto) {
		adminLentFacadeService.endUserLent(returnUserRequestDto.getUserIds());
	}
}
